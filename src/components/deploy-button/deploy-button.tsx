import { toast } from "react-toastify";

function DeployButton({
  html
}: {
  html: string;
}) {
  return (
    <div className="flex items-center justify-end gap-5">
      <div className="relative flex items-center justify-end">
      <button
        className="relative flex-none flex items-center justify-center rounded-md bg-blue-500 text-xs lg:text-sm font-semibold leading-5 lg:leading-6 py-1.5 px-5 hover:bg-blue-600 text-white shadow-sm dark:shadow-highlight/20 mr-2"
        onClick={() => {
          const blob = new Blob([html], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "exported-space.html";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          toast.success("HTML exportado com sucesso!");
        }}
      >
        Export
      </button>
      </div>
    </div>
  );
}

export default DeployButton;
