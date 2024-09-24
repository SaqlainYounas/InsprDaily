import { Poppins } from "next/font/google";
import { cn } from "@/app/Lib/Utils";
import { InputForm } from "@/components/Form/Input";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});
export default function Home() {
  return (
    <main className="flex h-full flex-col justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <div className="space-y-6">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md ",
            font.className
          )}
        >
          Inspir Daily
        </h1>
        <p className="text-white text-lg">
          A simple service for your daily motivation.
          <br />
          Give us your email and We'll send you an inspiring quote daily to help
          you be motivated.
        </p>
        <InputForm />
      </div>
    </main>
  );
}
