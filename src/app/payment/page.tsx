import Payment from "@/components/Payment";
import PaymentFIFO from "@/components/PaymentFIFO";
import { Label } from "@/components/ui/label";
import { PaymentQueueFIFOProvider } from "@/contexts/PaymenQueueFIFOProvider";
import { PaymentRetryQueueProvider } from "@/contexts/PyamentQueueProvider";
import React from "react";

const page = () => {
  return (
    <div className="grid grid-cols-2 max-w-5xl mx-auto pt-12">
      <div>
        <PaymentRetryQueueProvider>
          <Label>Payment parallel</Label>
          <Payment />
        </PaymentRetryQueueProvider>
      </div>
      <div>
        <PaymentQueueFIFOProvider>
          <Label>Payment FIFO</Label>
          <PaymentFIFO />
        </PaymentQueueFIFOProvider>
      </div>
    </div>
  );
};

export default page;
