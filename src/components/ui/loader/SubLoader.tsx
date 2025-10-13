import { Loader as LoadingIcon } from "lucide-react";
import { SubLoaderProps } from "../../../types/Loader";

function SubLoader({
  size = 24,
  color = "text-indigo-600",
  text = "loading ...",
  height = "70vh",
}: SubLoaderProps) {
  return (
      <div className={`min-h-[${height}] flex flex-col items-center justify-center`}>
      <LoadingIcon
        size={size}
        className={`text-indigo-600 dark:text-indigo-400 animate-spin mb-4 ${color}`}
      />
      <h2 className="text-xl font-medium text-gray-700 dark:text-white/80"> {text} </h2>
    </div>
  );
}

export default SubLoader;
