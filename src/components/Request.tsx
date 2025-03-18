"use client";
import { useApiQueue } from "@/contexts/ApiQueueProvider";
import React from "react";
import { Button } from "./ui/button";

const Request = () => {
  const { enqueueRequest } = useApiQueue();
  const fetchData = () => {
    enqueueRequest(async () => {
      console.log("Fetching data...");
      await new Promise((res) => {
        setTimeout(res, 2000);
      });
      console.log("Data fetched");
    });
  };
  return (
    <div onClick={fetchData}>
      <Button>Fetch Data</Button>
    </div>
  );
};

export default Request;
