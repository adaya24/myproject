# test_groq_new_model.py
from groq import Groq

# Your API key
API_KEY = "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"

print("Testing different Groq models...\n")

models_to_test = [
    "llama-3.1-8b-instant",
    "llama-3.2-1b-preview", 
    "mixtral-8x7b-32768",
    "gemma2-9b-it"
]

for model in models_to_test:
    print(f"Testing model: {model}")
    
    try:
        client = Groq(api_key=API_KEY)
        
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": "Say 'Hello' in one word"}],
            max_tokens=5
        )
        
        print(f"✅ Success! Response: {response.choices[0].message.content}")
        
    except Exception as e:
        print(f"❌ Failed: {e}")
    
    print("-" * 40)