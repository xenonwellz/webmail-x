import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:3333",
});

export const api = {
  getMailboxes: () => apiClient.get("/mailboxes"),
  getMailbox: (mailbox: string) => apiClient.get(`/mailboxes/${mailbox}`),
  getMailboxEmail: (mailbox: string, uid: string) =>
    apiClient.get(`/mailboxes/${mailbox}/emails/${uid}`),
};
