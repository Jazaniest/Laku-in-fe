import { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

const AIChatAssistant = () => {
  const [question, setQuestion] = useState('');
  const { loading, response, askAI, reset } = useAIAnalysis();

  const handleAsk = () => {
    if (question.trim()) {
      askAI(question);
    }
  };

  const suggestedQuestions = [
    'Bagaimana performa revenue saya?',
    'Apa yang harus saya tingkatkan?',
    'Analisis customer base saya',
    'Prediksi pertumbuhan bisnis saya'
  ];

  return (
    <Card className="bg-linear-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>Tanya apapun tentang bisnis Anda</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!response ? (
          <>
            <div className="space-y-2">
              <p className="text-sm text-zinc-600">Pertanyaan yang disarankan:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuestion(q)}
                    className="text-xs"
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Textarea
                placeholder="Contoh: Bagaimana cara meningkatkan profit saya?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-20"
              />
            </div>
            <Button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  AI sedang menganalisis...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Tanya AI
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-zinc-900 mb-2">AI Analysis</p>
                  <p className="text-sm text-zinc-700 leading-relaxed">{response}</p>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={reset} className="w-full">
              Tanya Lagi
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIChatAssistant
