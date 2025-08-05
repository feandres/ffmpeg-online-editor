import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Scissors,
  Settings,
  Volume2,
  Palette,
  Download,
  RotateCw,
  Crop,
  Sliders,
  Info,
  RefreshCw,
} from "lucide-react";


const t = {
  tabs: {
    basic: "Básico",
    effects: "Efeitos",
    audio: "Áudio",
    export: "Exportar",
  },
  trim: {
    title: "Cortar Vídeo",
    desc: "Defina começo e fim",
    enable: "Ativar corte de vídeo",
    start: "Começo (s)",
    end: "Fim (s)",
    error: "O início deve ser menor que o fim.",
  },
  resize: {
    title: "Reajustar",
    desc: "Escolha Resolução",
    enable: "Ativar redimensionamento",
    width: "Largura",
    height: "Altura",
    preset: "Preset de resolução",
    error: "Largura e altura devem ser maiores que zero.",
  },
  rotate: {
    title: "Rotacionar",
    desc: "Rotacione o vídeo",
    enable: "Ativar rotação",
  },
  effects: {
    title: "Ajustes de Cor",
    brightness: "Brilho",
    contrast: "Contraste",
    saturation: "Saturação",
  },
  audio: {
    title: "Volume",
    desc: "Ajuste volume",
    enable: "Ativar ajuste de volume",
    level: "Volume (%)",
  },
  export: {
    title: "Exportar",
    format: "Formato",
    select: "Selecione o formato",
  },
  process: "Processar",
  processing: "Processando...",
  reset: "Redefinir ajustes",
  success: "Configuração válida!",
  invalid: "Há campos inválidos. Corrija antes de processar.",
  tooltips: {
    trim: "Corte o vídeo entre dois pontos.",
    resize: "Redimensione para redes sociais.",
    rotate: "Gire o vídeo.",
    effects: "Ajuste brilho, contraste e saturação.",
    audio: "Ajuste o volume do vídeo.",
    export: "Escolha o formato de saída.",
    reset: "Redefinir todos os campos para o padrão.",
  },
};

export type EditConfig = {
  trim_start?: string;
  trim_end?: string;
  resize_width?: string;
  resize_height?: string;
  rotate_angle?: string;
  volume_level?: string;
  format?: string;
  brightness?: string;
  contrast?: string;
  saturation?: string;
  [key: string]: string | undefined;
};

const DEFAULTS: EditConfig = {
  trim_start: "0",
  trim_end: "30",
  resize_width: "1920",
  resize_height: "1080",
  rotate_angle: "0",
  volume_level: "100",
  format: "mp4",
  brightness: "50",
  contrast: "50",
  saturation: "50",
};

const presets = [
  { name: "Instagram Stories", width: "1080", height: "1920" },
  { name: "YouTube", width: "1920", height: "1080" },
  { name: "TikTok", width: "1080", height: "1920" },
  { name: "LinkedIn", width: "1200", height: "675" },
];

function validateConfig(config: EditConfig, enabled: any) {
  if (enabled.trim) {
    const start = Number(config.trim_start ?? "0");
    const end = Number(config.trim_end ?? "0");
    if (isNaN(start) || isNaN(end) || start < 0 || end <= start) {
      return t.trim.error;
    }
  }
  if (enabled.resize) {
    const w = Number(config.resize_width ?? "0");
    const h = Number(config.resize_height ?? "0");
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      return t.resize.error;
    }
  }
  return null;
}

export default function EditingPage({
  onApply,
  processing,
}: {
  onApply: (config: EditConfig) => void;
  processing: boolean;
}) {
  const [enabled, setEnabled] = useState({
    trim: false,
    resize: false,
    rotate: false,
    volume: false,
  });

  const [options, setOptions] = useState<EditConfig>({ ...DEFAULTS });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset para valores padrão
  const handleReset = () => {
    setOptions({ ...DEFAULTS });
    setEnabled({
      trim: false,
      resize: false,
      rotate: false,
      volume: false,
    });
    setError(null);
    setSuccess(false);
  };

  // Validação e envio
  const handleApply = () => {
    setError(null);
    setSuccess(false);
    const validation = validateConfig(options, enabled);
    if (validation) {
      setError(validation);
      return;
    }
    setSuccess(true);
    const config: EditConfig = { ...options };
    if (!enabled.trim) {
      delete config.trim_start;
      delete config.trim_end;
    }
    if (!enabled.resize) {
      delete config.resize_width;
      delete config.resize_height;
    }
    if (!enabled.rotate) {
      delete config.rotate_angle;
    }
    if (!enabled.volume) {
      delete config.volume_level;
    }
    onApply(config);
  };

  // Acessibilidade: foco visual
  const focusRing =
    "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

  return (
    <form
      className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl"
      role="form"
      aria-label="Configurações de edição de vídeo"
      onSubmit={(e) => {
        e.preventDefault();
        handleApply();
      }}
    >
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full mb-6 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="basic"
            className={`flex items-center gap-2 py-2 text-sm sm:text-base data-[state=active]:bg-white data-[state=active]:shadow-sm ${focusRing}`}
            aria-label={t.tabs.basic}
            title={t.tooltips.trim}
          >
            <Settings className="w-4 h-4" /> {t.tabs.basic}
          </TabsTrigger>
          <TabsTrigger
            value="effects"
            className={`flex items-center gap-2 py-2 text-sm sm:text-base data-[state=active]:bg-white data-[state=active]:shadow-sm ${focusRing}`}
            aria-label={t.tabs.effects}
            title={t.tooltips.effects}
          >
            <Palette className="w-4 h-4" /> {t.tabs.effects}
          </TabsTrigger>
          <TabsTrigger
            value="audio"
            className={`flex items-center gap-2 py-2 text-sm sm:text-base data-[state=active]:bg-white data-[state=active]:shadow-sm ${focusRing}`}
            aria-label={t.tabs.audio}
            title={t.tooltips.audio}
          >
            <Volume2 className="w-4 h-4" /> {t.tabs.audio}
          </TabsTrigger>
          <TabsTrigger
            value="export"
            className={`flex items-center gap-2 py-2 text-sm sm:text-base data-[state=active]:bg-white data-[state=active]:shadow-sm ${focusRing}`}
            aria-label={t.tabs.export}
            title={t.tooltips.export}
          >
            <Download className="w-4 h-4" /> {t.tabs.export}
          </TabsTrigger>
        </TabsList>

        {/* Basic */}
        <TabsContent value="basic" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 sm:gap-6">
            {/* Trim */}
            <TrimCard
              enabled={enabled.trim}
              setEnabled={(val: boolean) =>
                setEnabled((prev) => ({ ...prev, trim: val }))
              }
              options={options}
              setOptions={setOptions}
              focusRing={focusRing}
            />
            {/* Resize */}
            <ResizeCard
              enabled={enabled.resize}
              setEnabled={(val: boolean) =>
                setEnabled((prev) => ({ ...prev, resize: val }))
              }
              options={options}
              setOptions={setOptions}
              focusRing={focusRing}
            />
            {/* Rotate */}
            <RotateCard
              enabled={enabled.rotate}
              setEnabled={(val: boolean) =>
                setEnabled((prev) => ({ ...prev, rotate: val }))
              }
              options={options}
              setOptions={setOptions}
              focusRing={focusRing}
            />
          </div>
        </TabsContent>

        {/* Effects */}
        <TabsContent value="effects" className="mt-0">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex gap-2 items-center text-lg">
                <Sliders className="w-5 h-5 text-blue-600" />
                {t.effects.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {(["brightness", "contrast", "saturation"] as const).map((key) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{t.effects[key]}</Label>
                  <Slider
                    id={key}
                    aria-label={t.effects[key]}
                    value={[Number(options[key] || "50")]}
                    onValueChange={(val) =>
                      setOptions((prev) => ({
                        ...prev,
                        [key]: String(val[0]),
                      }))
                    }
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                  <span className="text-sm text-gray-500">{options[key]}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audio */}
        <TabsContent value="audio" className="mt-0">
          <VolumeCard
            enabled={enabled.volume}
            setEnabled={(val: boolean) =>
              setEnabled((prev) => ({ ...prev, volume: val }))
            }
            options={options}
            setOptions={setOptions}
            focusRing={focusRing}
          />
        </TabsContent>

        {/* Export */}
        <TabsContent value="export" className="mt-0">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Download className="w-5 h-5 text-blue-600" />
                {t.export.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="export-format">{t.export.format}</Label>
              <Select
                value={options.format}
                onValueChange={(val) =>
                  setOptions((prev) => ({ ...prev, format: val }))
                }
              >
                <SelectTrigger
                  id="export-format"
                  className={`mt-1 ${focusRing}`}
                  aria-label={t.export.select}
                >
                  <SelectValue placeholder={t.export.select} />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="mp4">MP4</SelectItem>
                  <SelectItem value="webm">WebM</SelectItem>
                  <SelectItem value="avi">AVI</SelectItem>
                  <SelectItem value="mov">MOV</SelectItem> */}
                  <SelectItem value="gif">GIF</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Feedback de erro/sucesso */}
      <div aria-live="polite" className="min-h-[1.5em] mt-4">
        {error && (
          <div className="text-red-600 text-sm flex items-center gap-2" role="alert">
            <Info className="w-4 h-4" /> {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 text-sm flex items-center gap-2" role="status">
            <Info className="w-4 h-4" /> {t.success}
          </div>
        )}
      </div>

      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          className="w-full sm:w-auto h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          onClick={handleApply}
          disabled={processing}
          aria-label={t.process}
          type="submit"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              {t.processing}
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-3" />
              {t.process}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className={`w-full sm:w-auto h-12 text-lg flex items-center gap-2 ${focusRing}`}
          onClick={handleReset}
          aria-label={t.reset}
          type="button"
          title={t.tooltips.reset}
        >
          <RefreshCw className="w-5 h-5" />
          {t.reset}
        </Button>
      </div>
    </form>
  );
}

// Componentes extraídos para melhor reutilização e performance

function TrimCard({
  enabled,
  setEnabled,
  options,
  setOptions,
  focusRing,
}: any) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow" role="region" aria-label={t.trim.title}>
      <CardHeader className="flex flex-row items-center gap-3">
        <Scissors className="w-5 h-5 text-blue-600" />
        <div className="flex-1">
          <CardTitle className="text-lg">{t.trim.title}</CardTitle>
          <CardDescription>{t.trim.desc}</CardDescription>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
          aria-label={t.trim.enable}
          title={t.tooltips.trim}
          className={focusRing}
        />
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="trim-start">{t.trim.start}</Label>
            <Input
              id="trim-start"
              type="number"
              min="0"
              value={options.trim_start}
              onChange={(e) =>
                setOptions((prev: any) => ({ ...prev, trim_start: e.target.value }))
              }
              className={`mt-1 ${focusRing}`}
              aria-label={t.trim.start}
            />
          </div>
          <div>
            <Label htmlFor="trim-end">{t.trim.end}</Label>
            <Input
              id="trim-end"
              type="number"
              min="0"
              value={options.trim_end}
              onChange={(e) =>
                setOptions((prev: any) => ({ ...prev, trim_end: e.target.value }))
              }
              className={`mt-1 ${focusRing}`}
              aria-label={t.trim.end}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function ResizeCard({
  enabled,
  setEnabled,
  options,
  setOptions,
  focusRing,
}: any) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow" role="region" aria-label={t.resize.title}>
      <CardHeader className="flex flex-row items-center gap-3">
        <Crop className="w-5 h-5 text-green-600" />
        <div className="flex-1">
          <CardTitle className="text-lg">{t.resize.title}</CardTitle>
          <CardDescription>{t.resize.desc}</CardDescription>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
          aria-label={t.resize.enable}
          title={t.tooltips.resize}
          className={focusRing}
        />
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {presets.map((p) => (
              <Button
                key={p.name}
                variant={
                  options.resize_width === p.width &&
                  options.resize_height === p.height
                    ? "default"
                    : "outline"
                }
                className={`text-sm ${focusRing}`}
                onClick={() =>
                  setOptions((prev: any) => ({
                    ...prev,
                    resize_width: p.width,
                    resize_height: p.height,
                  }))
                }
                aria-label={`${t.resize.preset}: ${p.name}`}
                title={`${t.resize.preset}: ${p.name}`}
                type="button"
              >
                {p.name}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="resize-width">{t.resize.width}</Label>
              <Input
                id="resize-width"
                type="number"
                min="1"
                value={options.resize_width}
                onChange={(e) =>
                  setOptions((prev: any) => ({
                    ...prev,
                    resize_width: e.target.value,
                  }))
                }
                className={`mt-1 ${focusRing}`}
                aria-label={t.resize.width}
              />
            </div>
            <div>
              <Label htmlFor="resize-height">{t.resize.height}</Label>
              <Input
                id="resize-height"
                type="number"
                min="1"
                value={options.resize_height}
                onChange={(e) =>
                  setOptions((prev: any) => ({
                    ...prev,
                    resize_height: e.target.value,
                  }))
                }
                className={`mt-1 ${focusRing}`}
                aria-label={t.resize.height}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function RotateCard({
  enabled,
  setEnabled,
  options,
  setOptions,
  focusRing,
}: any) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow" role="region" aria-label={t.rotate.title}>
      <CardHeader className="flex flex-row items-center gap-3">
        <RotateCw className="w-5 h-5 text-purple-600" />
        <div className="flex-1">
          <CardTitle className="text-lg">{t.rotate.title}</CardTitle>
          <CardDescription>{t.rotate.desc}</CardDescription>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
          aria-label={t.rotate.enable}
          title={t.tooltips.rotate}
          className={focusRing}
        />
      </CardHeader>
      {enabled && (
        <CardContent className="flex flex-wrap gap-2">
          {[0, 90, 180, 270].map((angle) => (
            <Button
              key={angle}
              variant={options.rotate_angle === String(angle) ? "default" : "outline"}
              onClick={() =>
                setOptions((prev: any) => ({ ...prev, rotate_angle: String(angle) }))
              }
              className={`text-sm ${focusRing}`}
              aria-label={`Rotacionar ${angle} graus`}
              title={`Rotacionar ${angle} graus`}
              type="button"
            >
              {angle}°
            </Button>
          ))}
        </CardContent>
      )}
    </Card>
  );
}

function VolumeCard({
  enabled,
  setEnabled,
  options,
  setOptions,
  focusRing,
}: any) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow" role="region" aria-label={t.audio.title}>
      <CardHeader className="flex flex-row items-center gap-3">
        <Volume2 className="w-5 h-5 text-red-600" />
        <div className="flex-1">
          <CardTitle className="text-lg">{t.audio.title}</CardTitle>
          <CardDescription>{t.audio.desc}</CardDescription>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
          aria-label={t.audio.enable}
          title={t.tooltips.audio}
          className={focusRing}
        />
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-2">
          <Label htmlFor="volume-level">{t.audio.level}</Label>
          <Slider
            id="volume-level"
            aria-label={t.audio.level}
            value={[Number(options.volume_level)]}
            onValueChange={(val) =>
              setOptions((prev: any) => ({ ...prev, volume_level: String(val[0]) }))
            }
            max={200}
            step={1}
            className={`mt-2 ${focusRing}`}
          />
          <span className="text-sm text-gray-500">{options.volume_level}%</span>
        </CardContent>
      )}
    </Card>
  );
}