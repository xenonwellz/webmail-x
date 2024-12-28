import type { HttpContext } from '@adonisjs/core/http'
import { ImapService } from '#services/imap_service'
import env from '#start/env'

export const getImapService = () => {
  return new ImapService({
    host: env.get('IMAP_HOST'),
    port: env.get('IMAP_PORT'),
    secure: true,
    auth: {
      user: env.get('IMAP_USER'),
      pass: env.get('IMAP_PASSWORD'),
    },
  })
}

export default class MailboxesController {
  public async index(ctx: HttpContext) {
    const mailboxes = await getImapService().listMailboxes()
    return ctx.response.json({ mailboxes })
  }

  public async show(ctx: HttpContext) {
    const { mailbox } = ctx.params
    const emails = await getImapService().fetchEmails(mailbox)
    return ctx.response.json({ emails })
  }

  public async showEmail(ctx: HttpContext) {
    const { mailbox, uid } = ctx.params
    const email = await getImapService().getEmail(mailbox, uid)
    return ctx.response.json({ email })
  }
}
