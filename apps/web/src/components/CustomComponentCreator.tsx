import React, { useState, useCallback, useRef } from 'react';
import { api } from '@/services/api';
import { X, Sparkles, Upload, Plus, Trash2, Loader2 } from 'lucide-react';

interface TagBinding {
  suffix: string;
  label: string;
  dataType: string;
}

interface CustomComponentCreatorProps {
  projectId: string;
  onClose: () => void;
  onSaved: () => void;
  editComponent?: {
    id: string;
    name: string;
    description?: string;
    category: string;
    svgCode: string;
    width: number;
    height: number;
    tagBindings?: TagBinding[];
  } | null;
}

export default function CustomComponentCreator({ projectId, onClose, onSaved, editComponent }: CustomComponentCreatorProps) {
  const [tab, setTab] = useState<'describe' | 'sketch'>('describe');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('scada');
  const [svgCode, setSvgCode] = useState(editComponent?.svgCode || '');
  const [name, setName] = useState(editComponent?.name || '');
  const [componentDesc, setComponentDesc] = useState(editComponent?.description || '');
  const [category, setCategory] = useState(editComponent?.category || 'Custom');
  const [width, setWidth] = useState(editComponent?.width || 80);
  const [height, setHeight] = useState(editComponent?.height || 60);
  const [tagBindings, setTagBindings] = useState<TagBinding[]>(editComponent?.tagBindings || []);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSvgEditor, setShowSvgEditor] = useState(false);
  const [sketchPreview, setSketchPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = useCallback(async (sketch?: string) => {
    setGenerating(true);
    try {
      const { data } = await api.post('/ai/generate-svg', {
        description: description || name || 'component',
        sketch,
        style,
      });
      setSvgCode(data.svg || '');
      if (data.tagBindings?.length) {
        setTagBindings(data.tagBindings);
      }
      // Auto-set name from description if empty
      if (!name && description) {
        setName(description.slice(0, 50));
      }
    } catch (err) {
      console.error('Generate SVG error:', err);
    } finally {
      setGenerating(false);
    }
  }, [description, name, style]);

  const handleSketchUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSketchPreview(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleConvertSketch = useCallback(() => {
    if (sketchPreview) {
      handleGenerate(sketchPreview);
    }
  }, [sketchPreview, handleGenerate]);

  const handleSave = useCallback(async () => {
    if (!name.trim() || !svgCode.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description: componentDesc || null,
        category: category || 'Custom',
        svgCode,
        width,
        height,
        tagBindings: tagBindings.length > 0 ? tagBindings : null,
        thumbnail: svgCode,
        projectId,
      };

      if (editComponent?.id) {
        await api.put(`/custom-components/${editComponent.id}`, payload);
      } else {
        await api.post('/custom-components', payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error('Save component error:', err);
    } finally {
      setSaving(false);
    }
  }, [name, componentDesc, category, svgCode, width, height, tagBindings, projectId, editComponent, onSaved, onClose]);

  const addTagBinding = () => {
    setTagBindings([...tagBindings, { suffix: '', label: '', dataType: 'boolean' }]);
  };

  const updateTagBinding = (index: number, field: keyof TagBinding, value: string) => {
    const updated = [...tagBindings];
    updated[index] = { ...updated[index], [field]: value };
    setTagBindings(updated);
  };

  const removeTagBinding = (index: number) => {
    setTagBindings(tagBindings.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#0F172A] border border-[#1E293B] rounded-xl w-[900px] max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B]">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            {editComponent ? 'Edit Component' : 'Create Custom Component'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setTab('describe')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === 'describe' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-[#1E293B] text-gray-400 border border-transparent hover:text-white'
              }`}
            >
              ✏️ Describe
            </button>
            <button
              onClick={() => setTab('sketch')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === 'sketch' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-[#1E293B] text-gray-400 border border-transparent hover:text-white'
              }`}
            >
              📷 Upload Sketch
            </button>
          </div>

          {/* Tab content */}
          {tab === 'describe' ? (
            <div className="space-y-3">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the component... e.g., '3-phase motor with cooling fan' or 'pressure relief valve with gauge'"
                className="w-full h-24 bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <div className="flex items-center gap-3">
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="scada">SCADA Style</option>
                  <option value="schematic">Schematic</option>
                  <option value="simple">Simple</option>
                </select>
                <button
                  onClick={() => handleGenerate()}
                  disabled={generating || !description.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate SVG
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#334155] rounded-lg p-8 text-center cursor-pointer hover:border-cyan-500/50 transition-colors"
              >
                {sketchPreview ? (
                  <img src={sketchPreview} alt="Sketch" className="max-h-40 mx-auto rounded" />
                ) : (
                  <div className="text-gray-400">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Click or drop an image of your sketch</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleSketchUpload} />
              <button
                onClick={handleConvertSketch}
                disabled={generating || !sketchPreview}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Convert to SVG
              </button>
            </div>
          )}

          {/* Preview */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Preview</h3>
              <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 flex items-center justify-center min-h-[160px]">
                {svgCode ? (
                  <div dangerouslySetInnerHTML={{ __html: svgCode }} className="max-w-full max-h-[140px]" />
                ) : (
                  <p className="text-gray-500 text-sm">Generate or paste SVG to preview</p>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-400">SVG Code</h3>
                <button
                  onClick={() => setShowSvgEditor(!showSvgEditor)}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  {showSvgEditor ? 'Hide Editor' : 'Edit SVG'}
                </button>
              </div>
              {showSvgEditor ? (
                <textarea
                  value={svgCode}
                  onChange={(e) => setSvgCode(e.target.value)}
                  className="w-full h-[160px] bg-[#0D1117] border border-[#334155] rounded-lg px-3 py-2 text-cyan-300 font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              ) : (
                <div className="bg-[#0D1117] border border-[#334155] rounded-lg px-3 py-2 h-[160px] overflow-auto">
                  <pre className="text-cyan-300/60 font-mono text-xs whitespace-pre-wrap">{svgCode || 'No SVG code yet'}</pre>
                </div>
              )}
            </div>
          </div>

          {/* Properties */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Component name"
                  className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                <input
                  value={componentDesc}
                  onChange={(e) => setComponentDesc(e.target.value)}
                  placeholder="Optional description"
                  className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Custom"
                  className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Width</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value) || 80)}
                    className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Height</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 60)}
                    className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tag Bindings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-400">Tag Binding Points</h3>
              <button onClick={addTagBinding} className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            {tagBindings.length > 0 ? (
              <div className="space-y-2">
                {tagBindings.map((tb, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={tb.suffix}
                      onChange={(e) => updateTagBinding(i, 'suffix', e.target.value)}
                      placeholder="suffix"
                      className="flex-1 bg-[#1E293B] border border-[#334155] rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    <input
                      value={tb.label}
                      onChange={(e) => updateTagBinding(i, 'label', e.target.value)}
                      placeholder="Label"
                      className="flex-1 bg-[#1E293B] border border-[#334155] rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    <select
                      value={tb.dataType}
                      onChange={(e) => updateTagBinding(i, 'dataType', e.target.value)}
                      className="text-gray-900 bg-white border border-gray-300 rounded px-2 py-1.5 text-xs"
                    >
                      <option value="boolean">Boolean</option>
                      <option value="number">Number</option>
                      <option value="string">String</option>
                    </select>
                    <button onClick={() => removeTagBinding(i)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No tag bindings defined. Click Add to create binding points.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1E293B]">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim() || !svgCode.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {editComponent ? 'Update Component' : 'Save Component'}
          </button>
        </div>
      </div>
    </div>
  );
}
