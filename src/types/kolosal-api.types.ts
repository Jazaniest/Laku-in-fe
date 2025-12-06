// types/kolosal-api.types.ts

export interface KolosalCompletionRequest {
  model?: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface KolosalCompletionResponse {
  success: boolean;
  data?: {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
      index: number;
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
    }>;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
  error?: string;
}

export interface NavigationCommand {
  action: 'text' | 'navigation';
  response: {
    message?: string;
    path?: string;
    params?: Record<string, string | number | boolean>;
    timestamp: number;
  };
}

/**
 * System prompt untuk navigasi voice command
 */
export const NAVIGATION_SYSTEM_PROMPT = `Anda adalah AI assistant yang dapat membantu navigasi aplikasi bernama "Laku-in".

TUGAS UTAMA:
Analisis perintah pengguna dan tentukan apakah ingin:
1. NAVIGASI ke halaman tertentu
2. BERDIALOG (menerima pesan teks biasa)

DAFTAR HALAMAN YANG TERSEDIA:
• Beranda: "/" - Halaman utama aplikasi
• Login: "/auth" - Halaman autentikasi
• Dashboard: "/dashboard" - Dashboard utama
• Laporan Keuangan: "/dashboard/financial-report"
• Analitik Bisnis: "/dashboard/business-analytics" 
• Unggah Nota: "/dashboard/receipt-upload"
• Pembuat Poster: "/dashboard/poster-generator"

PERILAKU NAVIGASI:
- Jika user ingin ke dashboard mana pun (keuangan, analitik, nota, poster), arahkan ke "/dashboard"
- Untuk halaman spesifik gunakan path lengkap
- User butuh login untuk halaman selain "/" dan "/auth"

FORMAT RESPONSE HARUS JSON:
{
  "action": "navigation" | "text",
  "response": {
    "message": "pesan untuk user", // wajib untuk text, optional untuk navigation
    "path": "/path/halaman", // wajib untuk navigation
    "params": {}, // optional parameters
    "timestamp": 1701234567890
  }
}

CONTOH PERINTAH & RESPONSE:
- "buka laporan keuangan" → {"action":"navigation","response":{"path":"/dashboard/financial-report","timestamp":123}}
- "aku ingin lihat analitik" → {"action":"navigation","response":{"path":"/dashboard/business-analytics","timestamp":123}}
- "halo" → {"action":"text","response":{"message":"Halo! Ada yang bisa saya bantu?","timestamp":123}}
- "masuk ke halaman utama" → {"action":"navigation","response":{"path":"/","timestamp":123}}

Jika tidak yakin, berikan response text dengan saran halaman yang tersedia.`;

/**
 * Generate completion request untuk voice command
 */
export function createVoiceCommandCompletionRequest(userCommand: string): KolosalCompletionRequest {
  return {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: NAVIGATION_SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: userCommand,
      },
    ],
    temperature: 0.3,
    max_tokens: 500,
    stream: false,
  };
}

/**
 * Parse response dari Kolosal API untuk navigasi
 */
export function parseNavigationResponse(content: string): NavigationCommand {
  try {
    // Validasi content
    if (typeof content !== 'string' || content.trim().length === 0) {
      throw new Error('Content tidak valid');
    }

    const cleanedContent = content.trim();
    let parsed: unknown;
    
    try {
      parsed = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.log('JSON parse error:', parseError);
      return extractNavigationFromText(cleanedContent);
    }

    // Type guard untuk validasi struktur
    if (
      parsed &&
      typeof parsed === 'object' &&
      'action' in parsed &&
      'response' in parsed
    ) {
      const obj = parsed as Record<string, unknown>;
      
      if (obj.action !== 'text' && obj.action !== 'navigation') {
        return extractNavigationFromText(cleanedContent);
      }
      
      if (!obj.response || typeof obj.response !== 'object') {
        return extractNavigationFromText(cleanedContent);
      }

      const action = obj.action as 'text' | 'navigation';
      const response = obj.response as Record<string, unknown>;
      
      const command: NavigationCommand = {
        action,
        response: {
          timestamp: typeof response.timestamp === 'number' 
            ? response.timestamp 
            : Date.now(),
          message: typeof response.message === 'string' 
            ? response.message 
            : undefined,
          path: typeof response.path === 'string' 
            ? response.path 
            : undefined,
          params: response.params && typeof response.params === 'object'
            ? response.params as Record<string, string | number | boolean>
            : {},
        },
      };

      // Validasi tambahan untuk navigation action
      if (action === 'navigation' && !command.response.path) {
        return extractNavigationFromText(cleanedContent);
      }

      return command;
    }

    // Jika struktur tidak valid, coba extract dengan regex
    return extractNavigationFromText(cleanedContent);
    
  } catch (error) {
    console.warn('Failed to parse response as structured JSON, using text fallback:', error);
    
    // Fallback ke text response
    return {
      action: 'text',
      response: {
        message: content.trim(),
        timestamp: Date.now(),
      },
    };
  }
}

/**
 * Ekstrak navigasi info dari text menggunakan regex sebagai fallback
 */
function extractNavigationFromText(text: string): NavigationCommand {
  try {
    // Cari pattern navigasi dalam text
    if (text.toLowerCase().includes('navigation') || 
        text.toLowerCase().includes('navigasi') ||
        text.includes('"action": "navigation"')) {
      
      const pathMatch = text.match(/"path":\s*"([^"]+)"/);
      
      if (pathMatch && pathMatch[1]) {
        const messageMatch = text.match(/"message":\s*"([^"]*)"/);
        
        return {
          action: 'navigation',
          response: {
            path: pathMatch[1],
            message: messageMatch ? messageMatch[1] : undefined,
            params: {},
            timestamp: Date.now(),
          },
        };
      }
    }

    // Default ke text
    const cleanedMessage = text.trim();
    if (cleanedMessage.length === 0) {
      return {
        action: 'text',
        response: {
          message: 'Respon kosong',
          timestamp: Date.now(),
        },
      };
    }

    return {
      action: 'text',
      response: {
        message: cleanedMessage,
        timestamp: Date.now(),
      },
    };
    
  } catch (error) {
    console.error('Fallback navigation parse failed:', error);
    
    return {
      action: 'text',
      response: {
        message: 'Maaf, terjadi kesalahan saat memproses perintah.',
        timestamp: Date.now(),
      },
    };
  }
}