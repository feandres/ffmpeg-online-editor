import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Scissors, 
  Settings, 
  Volume2, 
  Palette, 
  FileVideo, 
  Download,
  RotateCw,
  Crop,
  Sliders,
  Music,
  Type,
  Filter
} from 'lucide-react';

export default function VideoEditorOptions() {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    trim: { enabled: false, start: 0, end: 30 },
    resize: { enabled: false, width: 1920, height: 1080 },
    rotate: { enabled: false, angle: 0 },
    volume: { enabled: false, level: 100 },
    quality: 'high',
    format: 'mp4',
    brightness: 50,
    contrast: 50,
    saturation: 50,
    addText: { enabled: false, text: '', position: 'center' },
    addAudio: { enabled: false },
    filters: []
  });

  const [processing, setProcessing] = useState(false);

  interface TrimOptions {
    enabled: boolean;
    start: number;
    end: number;
  }

  interface ResizeOptions {
    enabled: boolean;
    width: number;
    height: number;
  }

  interface RotateOptions {
    enabled: boolean;
    angle: number;
  }

  interface VolumeOptions {
    enabled: boolean;
    level: number;
  }

  interface AddTextOptions {
    enabled: boolean;
    text: string;
    position: 'top' | 'center' | 'bottom';
  }

  interface AddAudioOptions {
    enabled: boolean;
  }

  type FilterId = 'vintage' | 'bw' | 'sepia' | 'vivid';

  interface SelectedOptions {
    trim: TrimOptions;
    resize: ResizeOptions;
    rotate: RotateOptions;
    volume: VolumeOptions;
    quality: 'low' | 'medium' | 'high';
    format: 'mp4' | 'webm' | 'avi' | 'mov';
    brightness: number;
    contrast: number;
    saturation: number;
    addText: AddTextOptions;
    addAudio: AddAudioOptions;
    filters: FilterId[];
  }

  const updateOption = <K extends keyof SelectedOptions, T extends keyof SelectedOptions[K]>(
    category: K,
    key: T,
    value: SelectedOptions[K][T]
  ) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: {
        ...prev[category] as object,
        [key]: value
      }
    }));
  };

  interface ToggleOptionArg {
    enabled: boolean;
    [key: string]: any;
  }

  type ToggleOptionKey = 'trim' | 'resize' | 'rotate' | 'volume' | 'addText' | 'addAudio';

  const toggleOption = (option: ToggleOptionKey) => {
    setSelectedOptions(prev => ({
      ...prev,
      [option]: {
        ...prev[option] as ToggleOptionArg,
        enabled: !prev[option].enabled
      }
    }));
  };

  const handleProcess = () => {
    setProcessing(true);
    // Aqui você implementaria a lógica do ffmpeg-wasm
    setTimeout(() => {
      setProcessing(false);
      alert('Vídeo processado com sucesso!');
    }, 3000);
  };

  const presets = [
    { name: 'Instagram Stories', width: 1080, height: 1920, description: '9:16 vertical' },
    { name: 'YouTube', width: 1920, height: 1080, description: '16:9 horizontal' },
    { name: 'TikTok', width: 1080, height: 1920, description: '9:16 vertical' },
    { name: 'LinkedIn', width: 1200, height: 675, description: '16:9 horizontal' }
  ];

  const filters: { id: FilterId; name: string; icon: string }[] = [
    { id: 'vintage', name: 'Vintage', icon: '📼' },
    { id: 'bw', name: 'Preto e Branco', icon: '⚫' },
    { id: 'sepia', name: 'Sépia', icon: '🟤' },
    { id: 'vivid', name: 'Cores Vivas', icon: '🌈' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-3 flex items-center justify-center gap-3">
            <FileVideo className="w-8 h-8 text-blue-600" />
            Editor de Vídeo Rápido
          </h1>
          <p className="text-slate-600 text-lg">Configure as opções de edição para seu vídeo</p>
        </div>

        {/* Video Preview Area */}
        <Card className="mb-8 border-2 border-dashed border-slate-300 bg-white/50">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center h-64 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300">
              <FileVideo className="w-16 h-16 text-slate-400 mb-4" />
              <p className="text-slate-500 text-lg font-medium">Visualização do vídeo aparecerá aqui</p>
              <p className="text-slate-400 text-sm mt-2">Duração: 0:30 | Resolução: 1920x1080</p>
            </div>
          </CardContent>
        </Card>

        {/* Main Options */}
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 mb-6">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Básico
            </TabsTrigger>
            <TabsTrigger value="effects" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Efeitos
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Áudio
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </TabsTrigger>
          </TabsList>

          {/* Basic Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trim Video */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Scissors className="w-5 h-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">Cortar Vídeo</CardTitle>
                      <CardDescription>Defina início e fim do vídeo</CardDescription>
                    </div>
                    <Switch 
                      checked={selectedOptions.trim.enabled}
                      onCheckedChange={() => toggleOption('trim')}
                    />
                  </div>
                </CardHeader>
                {selectedOptions.trim.enabled && (
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Início (segundos)</Label>
                      <Slider
                        value={[selectedOptions.trim.start]}
                        onValueChange={(value) => updateOption('trim', 'start', value[0])}
                        max={60}
                        step={1}
                        className="mt-2"
                      />
                      <span className="text-sm text-slate-500">{selectedOptions.trim.start}s</span>
                    </div>
                    <div>
                      <Label>Fim (segundos)</Label>
                      <Slider
                        value={[selectedOptions.trim.end]}
                        onValueChange={(value) => updateOption('trim', 'end', value[0])}
                        max={60}
                        step={1}
                        className="mt-2"
                      />
                      <span className="text-sm text-slate-500">{selectedOptions.trim.end}s</span>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Resize Video */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Crop className="w-5 h-5 text-green-600" />
                    <div>
                      <CardTitle className="text-lg">Redimensionar</CardTitle>
                      <CardDescription>Altere a resolução do vídeo</CardDescription>
                    </div>
                    <Switch 
                      checked={selectedOptions.resize.enabled}
                      onCheckedChange={() => toggleOption('resize')}
                    />
                  </div>
                </CardHeader>
                {selectedOptions.resize.enabled && (
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {presets.map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            updateOption('resize', 'width', preset.width);
                            updateOption('resize', 'height', preset.height);
                          }}
                          className="p-2 h-auto flex flex-col items-center text-xs"
                        >
                          <span className="font-medium">{preset.name}</span>
                          <span className="text-slate-500">{preset.description}</span>
                        </Button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Largura</Label>
                        <Input
                          type="number"
                          value={selectedOptions.resize.width}
                          onChange={(e) => updateOption('resize', 'width', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Altura</Label>
                        <Input
                          type="number"
                          value={selectedOptions.resize.height}
                          onChange={(e) => updateOption('resize', 'height', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Rotate Video */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <RotateCw className="w-5 h-5 text-purple-600" />
                    <div>
                      <CardTitle className="text-lg">Rotacionar</CardTitle>
                      <CardDescription>Gire o vídeo em graus</CardDescription>
                    </div>
                    <Switch 
                      checked={selectedOptions.rotate.enabled}
                      onCheckedChange={() => toggleOption('rotate')}
                    />
                  </div>
                </CardHeader>
                {selectedOptions.rotate.enabled && (
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      {[0, 90, 180, 270].map((angle) => (
                        <Button
                          key={angle}
                          variant={selectedOptions.rotate.angle === angle ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateOption('rotate', 'angle', angle)}
                        >
                          {angle}°
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Add Text */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Type className="w-5 h-5 text-orange-600" />
                    <div>
                      <CardTitle className="text-lg">Adicionar Texto</CardTitle>
                      <CardDescription>Insira texto no vídeo</CardDescription>
                    </div>
                    <Switch 
                      checked={selectedOptions.addText.enabled}
                      onCheckedChange={() => toggleOption('addText')}
                    />
                  </div>
                </CardHeader>
                {selectedOptions.addText.enabled && (
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Texto</Label>
                      <Input
                        placeholder="Digite seu texto..."
                        value={selectedOptions.addText.text}
                        onChange={(e) => updateOption('addText', 'text', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Posição</Label>
                      <Select 
                        value={selectedOptions.addText.position}
                        onValueChange={(value) => updateOption('addText', 'position', value as 'top' | 'center' | 'bottom')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Superior</SelectItem>
                          <SelectItem value="center">Centro</SelectItem>
                          <SelectItem value="bottom">Inferior</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Effects Tab */}
          <TabsContent value="effects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Color Adjustments */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-blue-600" />
                    Ajustes de Cor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label>Brilho</Label>
                      <Slider
                        value={[selectedOptions.brightness]}
                        onValueChange={(value) => setSelectedOptions(prev => ({ ...prev, brightness: value[0] }))}
                        max={100}
                        className="mt-2"
                      />
                      <span className="text-sm text-slate-500">{selectedOptions.brightness}%</span>
                    </div>
                    <div>
                      <Label>Contraste</Label>
                      <Slider
                        value={[selectedOptions.contrast]}
                        onValueChange={(value) => setSelectedOptions(prev => ({ ...prev, contrast: value[0] }))}
                        max={100}
                        className="mt-2"
                      />
                      <span className="text-sm text-slate-500">{selectedOptions.contrast}%</span>
                    </div>
                    <div>
                      <Label>Saturação</Label>
                      <Slider
                        value={[selectedOptions.saturation]}
                        onValueChange={(value) => setSelectedOptions(prev => ({ ...prev, saturation: value[0] }))}
                        max={100}
                        className="mt-2"
                      />
                      <span className="text-sm text-slate-500">{selectedOptions.saturation}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-purple-600" />
                    Filtros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filters.map((filter) => (
                      <Button
                        key={filter.id}
                        variant={selectedOptions.filters.includes(filter.id) ? "default" : "outline"}
                        className="h-20 flex flex-col items-center gap-2 p-4"
                        onClick={() => {
                          const newFilters = selectedOptions.filters.includes(filter.id)
                            ? selectedOptions.filters.filter(f => f !== filter.id)
                            : [...selectedOptions.filters, filter.id];
                          setSelectedOptions(prev => ({ ...prev, filters: newFilters }));
                        }}
                      >
                        <span className="text-2xl">{filter.icon}</span>
                        <span className="text-sm">{filter.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Audio Tab */}
          <TabsContent value="audio" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Volume Control */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-red-600" />
                    <div>
                      <CardTitle className="text-lg">Controle de Volume</CardTitle>
                      <CardDescription>Ajuste o volume do áudio</CardDescription>
                    </div>
                    <Switch 
                      checked={selectedOptions.volume.enabled}
                      onCheckedChange={() => toggleOption('volume')}
                    />
                  </div>
                </CardHeader>
                {selectedOptions.volume.enabled && (
                  <CardContent>
                    <Label>Volume (%)</Label>
                    <Slider
                      value={[selectedOptions.volume.level]}
                      onValueChange={(value) => updateOption('volume', 'level', value[0])}
                      max={200}
                      className="mt-2"
                    />
                    <span className="text-sm text-slate-500">{selectedOptions.volume.level}%</span>
                  </CardContent>
                )}
              </Card>

              {/* Add Audio */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-green-600" />
                    <div>
                      <CardTitle className="text-lg">Adicionar Áudio</CardTitle>
                      <CardDescription>Adicione uma trilha sonora</CardDescription>
                    </div>
                    <Switch 
                      checked={selectedOptions.addAudio.enabled}
                      onCheckedChange={() => toggleOption('addAudio')}
                    />
                  </div>
                </CardHeader>
                {selectedOptions.addAudio.enabled && (
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Selecionar arquivo de áudio
                    </Button>
                  </CardContent>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-600" />
                  Configurações de Exportação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Formato</Label>
                    <Select 
                      value={selectedOptions.format}
                      onValueChange={(value) => setSelectedOptions(prev => ({ ...prev, format: value as 'mp4' | 'webm' | 'avi' | 'mov' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp4">MP4</SelectItem>
                        <SelectItem value="webm">WebM</SelectItem>
                        <SelectItem value="avi">AVI</SelectItem>
                        <SelectItem value="mov">MOV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Qualidade</Label>
                    <Select 
                      value={selectedOptions.quality}
                      onValueChange={(value) => setSelectedOptions(prev => ({ ...prev, quality: value as 'low' | 'medium' | 'high' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa (menor arquivo)</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta (maior arquivo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button 
            size="lg" 
            className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={handleProcess}
            disabled={processing}
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processando...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-3" />
                Processar Vídeo
              </>
            )}
          </Button>
          <Button variant="outline" size="lg" className="h-12 text-lg">
            Pré-visualizar
          </Button>
        </div>

        {/* Selected Options Summary */}
        <Card className="mt-6 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg">Resumo das Configurações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedOptions.trim.enabled && (
                <Badge variant="secondary">Cortar: {selectedOptions.trim.start}s - {selectedOptions.trim.end}s</Badge>
              )}
              {selectedOptions.resize.enabled && (
                <Badge variant="secondary">Redimensionar: {selectedOptions.resize.width}x{selectedOptions.resize.height}</Badge>
              )}
              {selectedOptions.rotate.enabled && (
                <Badge variant="secondary">Rotação: {selectedOptions.rotate.angle}°</Badge>
              )}
              {selectedOptions.volume.enabled && (
                <Badge variant="secondary">Volume: {selectedOptions.volume.level}%</Badge>
              )}
              {selectedOptions.addText.enabled && selectedOptions.addText.text && (
                <Badge variant="secondary">Texto: "{selectedOptions.addText.text}"</Badge>
              )}
              {selectedOptions.filters.length > 0 && (
                <Badge variant="secondary">Filtros: {selectedOptions.filters.length}</Badge>
              )}
              <Badge variant="outline">Formato: {selectedOptions.format.toUpperCase()}</Badge>
              <Badge variant="outline">Qualidade: {selectedOptions.quality}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}