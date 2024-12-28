import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const Component = () => {
  const [selectedMailbox, setSelectedMailbox] = useState<string | null>(null);

  const { data: mailboxes, isLoading: isLoadingMailboxes } = useQuery({
    queryKey: ["mailboxes"],
    queryFn: () => api.getMailboxes().then((res) => res.data),
    staleTime: Infinity,
    cacheTime: Infinity
  });

  const { data: mailBoxEmails = [], refetch: refetchEmails, isLoading: isLoadingEmails } = useQuery({
    queryKey: ["mailbox", selectedMailbox],
    queryFn: () => api.getMailbox(selectedMailbox || "INBOX").then((res) => res.data.emails),
    staleTime: Infinity,
    cacheTime: Infinity
  });

  const getMailboxEmails = (mailbox: string) => {
    setSelectedMailbox(mailbox);
    refetchEmails({ queryKey: ["mailbox", mailbox] });
  };

  return (
    <div className="grid grid-cols-[300px_1fr] gap-4 p-4">
      <div className="col-start-1">
        <h1 className="text-2xl font-bold mb-4">Mail Boxes</h1>
        {isLoadingMailboxes ? (
          <div>Loading mail boxes...</div>
        ) : mailboxes?.mailboxes?.length === 0 ? (
          <div>No mailboxes found</div>
        ) : (
          <div className="space-y-2">
            {mailboxes?.mailboxes.map((box: any) => (
              <button key={box.path} className="p-3 border rounded shadow hover:bg-gray-100 cursor-pointer block w-full text-left" onClick={() => {getMailboxEmails(box.path)}}>
                <h2 className="font-semibold capitalize">{box.path.toLowerCase()}</h2>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="col-start-2">
        {isLoadingEmails ? (
          <div>Loading emails...</div>
        ) : mailBoxEmails.length === 0 ? (
          <div>No emails found</div>
        ) : (
          mailBoxEmails.map((email: any) => (
            <div key={email.uid}>
              <p><b>{email.envelope.from[0].name && email.envelope.from[0].name + "-"}</b> {email.envelope.from[0].address}</p>
              <h2>{email.subject}</h2>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
