import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'

export interface ImapConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

export class ImapService {
  private client: ImapFlow
  private isConnected: boolean = false

  constructor(config: ImapConfig) {
    this.client = new ImapFlow(config)
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect()
      this.isConnected = true
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.logout()
      this.isConnected = false
    }
  }

  async listMailboxes() {
    await this.ensureConnected()
    const mailboxes = await this.client.list()
    return mailboxes
  }

  async openMailbox(path: string) {
    await this.ensureConnected()
    const lock = await this.client.getMailboxLock(path)
    try {
      return this.client.mailbox
    } finally {
      lock.release()
    }
  }

  async fetchEmails(path: string, options: { from?: string; to?: string; limit?: number } = {}) {
    await this.ensureConnected()
    const lock = await this.client.getMailboxLock(path)

    try {
      const messages = await this.client.fetchAll(`1:${options.limit || 10}`, {
        source: true,
        flags: true,
        envelope: true,
      })

      const results = await Promise.all(
        messages.map(async (message) => {
          const parsed = await simpleParser(message.source, {
            skipImageLinks: true,
          })

          return {
            uid: message.uid,
            flags: message.flags,
            envelope: message.envelope,
            subject: parsed.subject,
            date: parsed.date,
            from: parsed.from,
            to: parsed.to,
          }
        })
      )

      return results
    } finally {
      lock.release()
    }
  }

  async getEmail(path: string, uid: string) {
    await this.ensureConnected()
    const lock = await this.client.getMailboxLock(path)

    try {
      const message = await this.client.fetchOne(uid, {
        source: true,
        flags: true,
        envelope: true,
      })

      if (!message) {
        return null
      }

      const parsed = await simpleParser(message.source)
      return {
        uid: message.uid,
        flags: message.flags,
        envelope: message.envelope,
        parsed,
      }
    } finally {
      lock.release()
    }
  }

  private async ensureConnected() {
    if (!this.isConnected) {
      await this.connect()
    }
  }
}
