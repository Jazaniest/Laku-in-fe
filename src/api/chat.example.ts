// Example: api/chat.ts - Serverless API route example
// This file is for reference - actual implementation depends on your backend framework

/**
 * Example API route handler for Next.js or similar frameworks
 * This demonstrates how to implement a serverless chat API endpoint
 */
export const chatAPIHandler = async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ 
      type: 'error', 
      data: { error: 'Method not allowed' } 
    }), { status: 405 });
  }

  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(JSON.stringify({ 
        type: 'error', 
        data: { error: 'Pesan tidak valid' } 
      }), { status: 400 });
    }

    // Example responses based on message content
    const response = generateChatResponse(message.trim());
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    return new Response(JSON.stringify({ 
      type: 'error', 
      data: { error: 'Terjadi kesalahan saat memproses pesan' } 
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

/**
 * Generate chat response based on user input
 * In production, this would call your LLM API
 */
function generateChatResponse(message: string) {
  const lowerMessage = message.toLowerCase();
  
  // Dashboard navigation
  if (lowerMessage.includes('dashboard') || lowerMessage.includes('halaman utama')) {
    return {
      type: 'navigate',
      data: {
        path: '/dashboard',
        message: 'Saya akan mengarahkan Anda ke halaman dashboard.'
      }
    };
  }
  
  // Financial reports
  if (lowerMessage.includes('laporan') || lowerMessage.includes('keuangan')) {
    return {
      type: 'navigate',
      data: {
        path: '/dashboard/financial-report',
        message: 'Saya akan menampilkan laporan keuangan untuk Anda.'
      }
    };
  }
  
  // Analytics
  if (lowerMessage.includes('analitik') || lowerMessage.includes('statistik')) {
    return {
      type: 'navigate',
      data: {
        path: '/dashboard/business-analytics',
        message: 'Berikut adalah analitik bisnis Anda.'
      }
    };
  }
  
  // Receipt upload
  if (lowerMessage.includes('nota') || lowerMessage.includes('struk') || lowerMessage.includes('unggah')) {
    return {
      type: 'navigate',
      data: {
        path: '/dashboard/receipt-upload',
        message: 'Silakan upload nota Anda di halaman ini.'
      }
    };
  }
  
  // Poster generator
  if (lowerMessage.includes('poster') || lowerMessage.includes('promosi')) {
    return {
      type: 'navigate',
      data: {
        path: '/dashboard/poster-generator',
        message: 'Saya akan membuka pembuat poster untuk Anda.'
      }
    };
  }
  
  // Help/About
  if (lowerMessage.includes('bantuan') || lowerMessage.includes('tentang') || lowerMessage.includes('apa ini')) {
    return {
      type: 'text',
      data: {
        message: 'Laku-in adalah aplikasi manajemen bisnis untuk membantu mengelola keuangan, membuat laporan, dan membuat promosi. Saya bisa membantu Anda menjelajahi berbagai fitur yang tersedia.'
      }
    };
  }
  
  // Greeting
  if (lowerMessage.includes('halo') || lowerMessage.includes('hai') || lowerMessage.includes('helo')) {
    return {
      type: 'text',
      data: {
        message: 'Halo! Saya asisten Laku yang siap membantu Anda. Apa yang bisa saya bantu hari ini?'
      }
    };
  }
  
  // Financial/Status
  if (lowerMessage.includes('status') || lowerMessage.includes('kondisi')) {
    return {
      type: 'text',
      data: {
        message: 'Saya akan membantu mengecek status keuangan Anda. Anda bisa melihat dashboard untuk informasi lengkap.'
      }
    };
  }
  
  // Default response for unclear input
  return {
    type: 'text',
    data: {
      message: 'Saya memahami pesan Anda. Untuk pertanyaan spesifik, silakan coba: "Tampilkan dashboard", "Buka laporan keuangan", atau \"Bagaimana kondisi keuangan saya?\"'
    }
  };
}