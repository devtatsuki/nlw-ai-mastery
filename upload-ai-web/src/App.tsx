import { useCompletion } from "ai/react";
import { Copy, Github, Wand2 } from "lucide-react";
import { useState } from "react";
import { PromptSelect } from "./components/prompt-select";
import { Button } from "./components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./components/ui/hover-card";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Separator } from "./components/ui/separator";
import { Slider } from "./components/ui/slider";
import { Textarea } from "./components/ui/textarea";
import { VideoInputForm } from "./components/video-input-form";

export function App() {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<string | null>(null)
  const [temperature, setTemperature] = useState<number>(0.5);

  const clipboardCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setIsCopied(true);
    } catch (err) {
      console.error('Failed to copy: ', err);
    } finally {
      setTimeout(() => {
        setIsCopied(false);
      }, 2 * 1000)
    }
  }

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body: {
      videoId,
      temperature,
    },
    headers: {
      'Content-type': 'application/json',
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-md font-bold">upload.ai</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido com 💙 no NLW da Rocketseat
          </span>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="outline">
            <Github className="w-4 h-4 mr-2" />
            Github
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Inclua o prompt para a IA..."
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Resultado gerado pela IA..."
              value={completion}
              readOnly
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável {' '}
            <HoverCard>
              <HoverCardTrigger
                onClick={() => clipboardCopy('{transcription}')}
                className="text-blue-400 px-1 py-1 bg-blue-500/10 rounded-sm cursor-pointer"
                >
                <code>{!isCopied ? '{transcription}' : 'copiado'}</code>
              </HoverCardTrigger>
              <HoverCardContent className="flex items-center justify-center gap-2">
                <Copy className="w-4 h-4" />
                Clique para copiar
              </HoverCardContent>
            </HoverCard>
            {' '}
            no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado.
          </p>
        </div>
        
        <aside className="w-80 space-y-6">
          <VideoInputForm onVideoUploaded={setVideoId} />          

          <Separator />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <PromptSelect onPromptSelected={setInput} />
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select disabled defaultValue="gpt3.5-turbo">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5-turbo">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">
                Você poderá customizar essa opção em breve
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Temperatura</Label>
                <Label className="text-muted-foreground">{temperature}</Label>
              </div>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />
              <span className="block text-xs text-muted-foreground italic">
                Valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros.
              </span>
            </div>

            <Separator />

            <Button disabled={isLoading} type="submit" className="w-full">
              Executar
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}
