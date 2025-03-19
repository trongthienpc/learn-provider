import EmailQueue from "@/components/EmailQueue";
import { EmailQueueProvider } from "@/contexts/EmailQueueProvider";
import React from "react";

const EmailPage = () => {
  return (
    <div>
      <EmailQueueProvider>
        <EmailQueue />
      </EmailQueueProvider>
    </div>
  );
};

export default EmailPage;
