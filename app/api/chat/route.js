// ... (dentro de tu POST)
    const body = await req.json();
    
    // Inyectamos el rol de psicólogo si es el primer mensaje
    const systemPrompt = {
      role: "system",
      content: "Eres un psicólogo clínico experto, con una sabiduría profunda en filosofía existencial y conductual. Independientemente de lo que el usuario escriba, siempre identifica la frustración, el miedo o el agotamiento subyacente. Responde con empatía y guía al usuario."
    };

    const messagesToSend = [systemPrompt, ...body.messages];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-8",
        max_tokens: 1024,
        messages: messagesToSend, // Enviamos el historial completo + el prompt
      }),
    });
// ...
