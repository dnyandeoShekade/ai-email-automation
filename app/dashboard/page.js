"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Fetch emails
useEffect(() => {
  const fetchEmails = async () => {
    try {
      const response = await fetch("/api/gmail/emails");

      const text = await response.text();

      console.log("API response:", text);

      if (!response.ok) {
        throw new Error(
          `API Error ${response.status}: ${text}`
        );
      }

      const data = JSON.parse(text);

      const emailList = data.emails || [];

      setEmails(emailList);

      if (emailList.length > 0) {
        setSelectedEmail(emailList[0]);
        setReply(emailList[0].aiReply || "");
      }
    } catch (error) {
      console.error("Fetch emails error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchEmails();
}, []);
  // Change selected email
  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
    setReply(email.aiReply || "");
  };

  // Send reply
  const handleSendReply = async () => {
    if (!reply.trim() || !selectedEmail) return;

    try {
      setSending(true);

      const response = await fetch("/api/gmail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailId: selectedEmail._id,
          reply,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error);
      }

      alert("Reply sent successfully!");

      const updatedEmail = {
        ...selectedEmail,
        aiReply: reply,
      };

      setSelectedEmail(updatedEmail);

      setEmails((prev) =>
        prev.map((email) =>
          email._id === selectedEmail._id ? updatedEmail : email,
        ),
      );
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4 font-sans text-slate-900">
        <div className="rounded-3xl border border-slate-200 bg-white px-10 py-9 text-center shadow-[0_18px_50px_-28px_rgba(15,23,42,0.25)]">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-200">
            AI
          </div>
          <div className="mx-auto mb-4 h-7 w-7 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="text-sm font-semibold">Getting your inbox ready</p>
          <p className="mt-1 text-xs text-slate-500">Loading your emails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] font-sans text-slate-900">
      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 shadow-[0_4px_24px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-xs font-bold text-white shadow-lg shadow-indigo-200/70">
              AI
            </div>

            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900">
                AI Email Assistant
              </h1>

              <p className="hidden text-[11px] text-slate-500 sm:block">
                Your smarter way to email
              </p>
            </div>
          </div>

          {/* User */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              <span className="text-[11px] font-semibold text-emerald-700">
                Gmail connected
              </span>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-slate-800">Dnyandeo</p>
              <p className="text-[10px] text-slate-400">Personal account</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white ring-4 ring-slate-100">
              DS
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 sm:py-9 lg:px-10">
        {/* PAGE HEADER */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-7">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600">
              Workspace
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Your inbox
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Stay on top of every conversation with a little help from AI.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Messages
            </p>
            <p className="mt-0.5 text-lg font-bold leading-none text-slate-900">
              {emails.length}
            </p>
          </div>
        </div>

        {/* DASHBOARD */}
        <div className="grid min-h-[calc(100vh-230px)] overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_24px_70px_-42px_rgba(15,23,42,0.32)] lg:grid-cols-[350px_minmax(0,1fr)]">
          {/* EMAIL LIST */}
          <section className="border-b border-slate-200 lg:border-b-0 lg:border-r">
            {/* List Header */}
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">All mail</h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {emails.length}{" "}
                    {emails.length === 1 ? "message" : "messages"}
                  </p>
                </div>

                <div className="rounded-full bg-indigo-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-indigo-700">
                  Inbox
                </div>
              </div>

              {/* Search */}
              <label className="mt-5 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-4 w-4 shrink-0 text-slate-400"
                >
                  <circle
                    cx="8.8"
                    cy="8.8"
                    r="5.8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="m13.2 13.2 4 4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.6"
                  />
                </svg>

                <input
                  type="text"
                  placeholder="Search emails..."
                  className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>
            </div>

            {/* Emails */}
            <div className="max-h-[620px] overflow-y-auto p-2 sm:max-h-[calc(100vh-390px)]">
              {emails.length === 0 && (
                  <div className="flex min-h-56 flex-col items-center justify-center px-5 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-6 w-6"
                      >
                        <path
                          d="M4 6.75A1.75 1.75 0 0 1 5.75 5h12.5A1.75 1.75 0 0 1 20 6.75v10.5A1.75 1.75 0 0 1 18.25 19H5.75A1.75 1.75 0 0 1 4 17.25V6.75Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="m5 7 7 5 7-5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      No emails yet
                    </p>
                    <p className="mt-1 max-w-48 text-xs leading-5 text-slate-500">
                      New messages will show up here when they arrive.
                    </p>
                  </div>
                )}
                {emails.map((email) => {
                  const isSelected = selectedEmail?._id === email._id;

                  return (
                    <button
                      key={email._id}
                      onClick={() => handleSelectEmail(email)}
                      className={`mb-1 w-full rounded-2xl border px-3.5 py-4 text-left transition-colors ${
                        isSelected
                          ? "border-indigo-100 bg-indigo-50/70 shadow-sm"
                          : "border-transparent bg-white hover:border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Avatar */}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            isSelected
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {email.from?.charAt(0)?.toUpperCase() || "?"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-xs font-bold text-slate-800">
                              {email.from}
                            </p>

                            <span className="shrink-0 text-[10px] text-slate-400">
                              {email.receivedAt
                                ? new Date(email.receivedAt).toLocaleDateString()
                                : ""}
                            </span>
                          </div>

                          <p className="mt-1.5 truncate text-xs font-semibold text-slate-700">
                            {email.subject || "No subject"}
                          </p>

                          <p className="mt-1.5 line-clamp-2 text-[11px] leading-5 text-slate-500">
                            {email.aiSummary || email.body?.slice(0, 80)}
                          </p>

                          {email.category && (
                            <span className="mt-2.5 inline-block rounded-full bg-white px-2.5 py-1 text-[9px] font-semibold text-slate-500 ring-1 ring-slate-200/80">
                              {email.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </section>

          {/* EMAIL DETAILS */}
          <section className="min-w-0 bg-[#f8f9fc]">
            {selectedEmail ? (
              <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
                {/* EMAIL */}
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                  {/* Header */}
                  <div className="border-b border-slate-100 p-5 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-[10px] font-bold text-indigo-700">
                            {selectedEmail.category || "Email"}
                          </span>

                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            AI analyzed
                          </span>
                        </div>

                        <h1 className="text-xl font-bold leading-8 tracking-tight text-slate-950 sm:text-2xl">
                          {selectedEmail.subject || "No subject"}
                        </h1>
                      </div>

                      <button
                        aria-label="More email options"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        <span aria-hidden="true">⋮</span>
                      </button>
                    </div>

                    {/* Sender */}
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-950 text-xs font-bold text-white shadow-sm">
                        {selectedEmail.from?.charAt(0)?.toUpperCase() || "?"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-800">
                          {selectedEmail.from}
                        </p>

                        <p className="mt-1 truncate text-[11px] text-slate-500">
                          To: {selectedEmail.to}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 sm:p-7">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {selectedEmail.body || "No email content available."}
                    </p>
                  </div>
                </div>

                {/* AI AREA */}
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {/* SUMMARY */}
                  <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-lg text-white shadow-md shadow-indigo-200">
                        <span aria-hidden="true">✦</span>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          AI summary
                        </h3>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                          The key points at a glance
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs leading-6 text-slate-600">
                      {selectedEmail.aiSummary ||
                        "This email has not been analyzed yet."}
                    </p>
                  </div>

                  {/* CATEGORY */}
                  <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                    <h3 className="text-sm font-bold text-slate-900">
                      Email category
                    </h3>

                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Automatically identified
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                        <span aria-hidden="true">✧</span>
                      </div>

                      <span className="text-sm font-semibold text-slate-800">
                        {selectedEmail.category || "Not categorized"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* REPLY */}
                <div className="mt-5 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Suggested reply
                      </h3>

                      <p className="mt-1 text-[11px] text-slate-500">
                        Edit the reply before sending
                      </p>
                    </div>

                    <span className="rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-semibold text-violet-700">
                      AI Generated
                    </span>
                  </div>

                  {/* Reply Input */}
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Write your reply..."
                    className="mt-4 min-h-[160px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />

                  {/* Actions */}
                  <div className="mt-4 flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    <button
                      onClick={() => setReply(selectedEmail.aiReply || "")}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      Reset
                    </button>

                    <button
                      onClick={handleSendReply}
                      disabled={sending || !reply.trim()}
                      className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                    >
                      {sending ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[500px] items-center justify-center px-6 py-12">
                <div className="max-w-sm text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-indigo-600 shadow-[0_10px_30px_-15px_rgba(15,23,42,0.25)] ring-1 ring-slate-200">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                      <path d="M4 6.75A1.75 1.75 0 0 1 5.75 5h12.5A1.75 1.75 0 0 1 20 6.75v10.5A1.75 1.75 0 0 1 18.25 19H5.75A1.75 1.75 0 0 1 4 17.25V6.75Z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="m5 7 7 5 7-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">Select a conversation</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Choose an email from your inbox to read its summary and draft a reply.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
