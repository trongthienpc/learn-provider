import Music from "@/components/Music";
import Notifications from "@/components/Notifications";
import Printer from "@/components/Printer";
import Request from "@/components/Request";
import Speech from "@/components/Speech";
import Upload from "@/components/Upload";
import { ApiQueueProvider } from "@/contexts/ApiQueueProvider";
import { MusicQueueProvider } from "@/contexts/MusicQueueProvider";
import { NotificationProvider } from "@/contexts/NotificationProvider";
import { PrintQueueProvider } from "@/contexts/PrinterQueueProvider";
import { SpeechQueueProvider } from "@/contexts/SpeechQueueProvider";
import { FileUploadQueueProvider } from "@/contexts/UploadQueueProvider";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-3">
      <div className="flex gap-3">
        <NotificationProvider>
          <Notifications />
        </NotificationProvider>
        <ApiQueueProvider>
          <Request />
        </ApiQueueProvider>
      </div>
      <MusicQueueProvider>
        <div>
          <Music />
        </div>
      </MusicQueueProvider>
      <SpeechQueueProvider>
        <Speech />
      </SpeechQueueProvider>
      <FileUploadQueueProvider>
        <Upload />
      </FileUploadQueueProvider>
      <PrintQueueProvider>
        <Printer />
      </PrintQueueProvider>
    </div>
  );
}
