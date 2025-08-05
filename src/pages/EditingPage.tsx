import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Info } from "lucide-react";

export default function EditingPage({
  onApply,
  processing,
}: {
  onApply: (command: string) => void;
  processing: boolean;
}) {
  const [command, setCommand] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleApply = () => {
    if (!command.trim()) {
      setError("Please enter an FFmpeg command.");
      return;
    }
    setError(null);
    onApply(command);
  };

  const focusRing = "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

  return (
    <form
      className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl"
      role="form"
      aria-label="FFmpeg command input"
      onSubmit={(e) => {
        e.preventDefault();
        handleApply();
      }}
    >
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Play className="w-5 h-5 text-blue-600" />
            Insira o comando FFmpeg
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ffmpeg-command">Comando:</Label>
            <Input
              id="ffmpeg-command"
              type="text"
              placeholder="e.g., -ss 0 -t 3 -vf fps=10,scale=320:-1 -c:v gif"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              disabled={processing}
              className={`mt-1 ${focusRing}`}
              aria-label="Enter FFmpeg command"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm flex items-center gap-2" role="alert">
              <Info className="w-4 h-4" /> {error}
            </div>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
            disabled={processing}
            aria-label="Process video"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processing...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-3" />
                Process
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}