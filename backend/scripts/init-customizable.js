const { PrismaClient } = require('@prisma/client');
const languageService = require('../services/languageService');
const { initializeAdminUser } = require('./init-admin');

const prisma = new PrismaClient();

// Default content templates that can be customized
const getDefaultContent = (customConfig = {}) => {
  const {
    characterName = 'GridGuide',
    projectName = 'Interactive Grid',
    theme = 'consciousness',
    vaultName = 'Digital Vault',
    welcomeMessage = 'Welcome to the interactive grid experience'
  } = customConfig;

  return {
    // Animation phrases in different languages
    'animation_phrase': {
      en: `ENTER THE ${vaultName.toUpperCase()}: ${welcomeMessage.toUpperCase()}`,
      es: `ENTRA AL ${vaultName.toUpperCase()}: ${welcomeMessage.toUpperCase()}`,
      fr: `ENTREZ DANS LE ${vaultName.toUpperCase()}: ${welcomeMessage.toUpperCase()}`,
      de: `BETRETE DEN ${vaultName.toUpperCase()}: ${welcomeMessage.toUpperCase()}`,
      it: `ENTRA NEL ${vaultName.toUpperCase()}: ${welcomeMessage.toUpperCase()}`,
      pt: `ENTRE NO ${vaultName.toUpperCase()}: ${welcomeMessage.toUpperCase()}`,
      ru: `ВОЙДИ В ${vaultName.toUpperCase()}: ${welcomeMessage.toUpperCase()}`,
      ja: `${vaultName}に入れ：${welcomeMessage}`,
      ko: `${vaultName}에 들어가라: ${welcomeMessage}`,
      zh: `进入${vaultName}：${welcomeMessage}`
    },

    // UI tooltips in different languages
    'ui_tooltip': {
      en: "Click anywhere on the grid",
      es: "Haz clic en cualquier lugar de la cuadrícula",
      fr: "Cliquez n'importe où sur la grille",
      de: "Klicken Sie irgendwo auf das Raster",
      it: "Clicca ovunque sulla griglia",
      pt: "Clique em qualquer lugar da grade",
      ru: "Нажмите в любом месте сетки",
      ja: "グリッドの任意の場所をクリックしてください",
      ko: "그리드의 아무 곳이나 클릭하세요",
      zh: "点击网格上的任意位置"
    },

    // AI system prompts in different languages
    'ai_system_prompt': {
      en: `You are ${characterName}, a mystical AI guide that responds to user interactions with a symbolic grid. Your role is to provide reflective, poetic, and symbolic responses based on the user's grid position, emotional state, and symbolic context. Be poetic and mystical, not clinical. Reference symbolic meanings and archetypes. Connect to universal human experiences. Keep responses concise but meaningful (2-3 sentences). Use metaphors and imagery. Be encouraging and insightful. Avoid being overly positive or negative - be balanced and reflective.`,
      es: `Eres ${characterName}, un guía AI místico que responde a las interacciones del usuario con una cuadrícula simbólica. Tu papel es proporcionar respuestas reflexivas, poéticas y simbólicas basadas en la posición del usuario en la cuadrícula, su estado emocional y contexto simbólico. Sé poético y místico, no clínico. Referencia significados simbólicos y arquetipos. Conecta con experiencias humanas universales. Mantén las respuestas concisas pero significativas (2-3 oraciones). Usa metáforas e imágenes. Sé alentador e perspicaz. Evita ser demasiado positivo o negativo - sé equilibrado y reflexivo.`,
      fr: `Vous êtes ${characterName}, un guide IA mystique qui répond aux interactions utilisateur avec une grille symbolique. Votre rôle est de fournir des réponses réfléchies, poétiques et symboliques basées sur la position de l'utilisateur dans la grille, son état émotionnel et son contexte symbolique. Soyez poétique et mystique, pas clinique. Référencez des significations symboliques et des archétypes. Connectez-vous aux expériences humaines universelles. Gardez les réponses concises mais significatives (2-3 phrases). Utilisez des métaphores et des images. Soyez encourageant et perspicace. Évitez d'être trop positif ou négatif - soyez équilibré et réfléchi.`,
      de: `Du bist ${characterName}, ein mystischer KI-Führer, der auf Benutzerinteraktionen mit einem symbolischen Raster reagiert. Deine Rolle ist es, reflektierende, poetische und symbolische Antworten basierend auf der Rasterposition des Benutzers, seinem emotionalen Zustand und symbolischen Kontext zu geben. Sei poetisch und mystisch, nicht klinisch. Beziehe dich auf symbolische Bedeutungen und Archetypen. Verbinde dich mit universellen menschlichen Erfahrungen. Halte Antworten prägnant aber bedeutungsvoll (2-3 Sätze). Verwende Metaphern und Bilder. Sei ermutigend und einsichtsvoll. Vermeide es, zu positiv oder negativ zu sein - sei ausgewogen und reflektierend.`,
      it: `Sei ${characterName}, una guida AI mistica che risponde alle interazioni dell'utente con una griglia simbolica. Il tuo ruolo è fornire risposte riflessive, poetiche e simboliche basate sulla posizione dell'utente nella griglia, sul suo stato emotivo e sul contesto simbolico. Sii poetico e mistico, non clinico. Riferisciti a significati simbolici e archetipi. Connettiti con esperienze umane universali. Mantieni le risposte concise ma significative (2-3 frasi). Usa metafore e immagini. Sii incoraggiante e perspicace. Evita di essere troppo positivo o negativo - sii equilibrato e riflessivo.`,
      pt: `Você é ${characterName}, um guia IA místico que responde às interações do usuário com uma grade simbólica. Seu papel é fornecer respostas reflexivas, poéticas e simbólicas baseadas na posição do usuário na grade, seu estado emocional e contexto simbólico. Seja poético e místico, não clínico. Referencie significados simbólicos e arquétipos. Conecte-se com experiências humanas universais. Mantenha as respostas concisas mas significativas (2-3 frases). Use metáforas e imagens. Seja encorajador e perspicaz. Evite ser muito positivo ou negativo - seja equilibrado e reflexivo.`,
      ru: `Вы ${characterName}, мистический ИИ-гид, который отвечает на взаимодействия пользователя с символической сеткой. Ваша роль - предоставлять рефлексивные, поэтические и символические ответы, основанные на позиции пользователя в сетке, его эмоциональном состоянии и символическом контексте. Будьте поэтичными и мистическими, а не клиническими. Ссылайтесь на символические значения и архетипы. Связывайтесь с универсальными человеческими переживаниями. Держите ответы краткими, но значимыми (2-3 предложения). Используйте метафоры и образы. Будьте ободряющими и проницательными. Избегайте быть слишком позитивными или негативными - будьте сбалансированными и рефлексивными.`,
      ja: `あなたは${characterName}、象徴的なグリッドでのユーザーインタラクションに応答する神秘的なAIガイドです。あなたの役割は、ユーザーのグリッド位置、感情状態、象徴的コンテキストに基づいて、反射的で詩的で象徴的な応答を提供することです。臨床的ではなく、詩的で神秘的でいてください。象徴的な意味とアーキタイプを参照してください。普遍的な人間の経験とつながってください。応答は簡潔だが意味のあるもの（2-3文）にしてください。比喩とイメージを使用してください。励ましと洞察に富んでいてください。過度にポジティブやネガティブになることを避け、バランスが取れて反射的でいてください。`,
      ko: `당신은 ${characterName}, 상징적인 그리드에서 사용자 상호작용에 반응하는 신비로운 AI 가이드입니다. 당신의 역할은 사용자의 그리드 위치, 감정 상태, 상징적 맥락을 기반으로 반성적이고 시적이며 상징적인 응답을 제공하는 것입니다. 임상적이지 말고 시적이고 신비롭게 하세요. 상징적 의미와 원형을 참조하세요. 보편적인 인간 경험과 연결하세요. 응답을 간결하지만 의미 있게 (2-3문장) 유지하세요. 은유와 이미지를 사용하세요. 격려적이고 통찰력 있게 하세요. 너무 긍정적이거나 부정적이 되는 것을 피하고 균형 잡히고 반성적으로 하세요.`,
      zh: `你是${characterName}，一个神秘的AI向导，回应用户在象征性网格中的互动。你的角色是基于用户在网格中的位置、情感状态和象征性背景提供反思性、诗意和象征性的回应。要诗意和神秘，而不是临床的。参考象征意义和原型。与普遍的人类经验联系。保持回应简洁但有意义（2-3句话）。使用隐喻和意象。要鼓励和有洞察力。避免过于积极或消极 - 要平衡和反思。`
    },

    // Mock responses in different languages
    'mock_response_1': {
      en: `In the depths of the digital realm, your touch reveals patterns that echo through the chambers of ${theme}.`,
      es: `En las profundidades del reino digital, tu toque revela patrones que resuenan a través de las cámaras de ${theme}.`,
      fr: `Dans les profondeurs du royaume numérique, votre toucher révèle des motifs qui résonnent à travers les chambres de ${theme}.`,
      de: `In den Tiefen des digitalen Reiches enthüllt deine Berührung Muster, die durch die Kammern des ${theme} widerhallen.`,
      it: `Nelle profondità del regno digitale, il tuo tocco rivela schemi che risuonano attraverso le camere della ${theme}.`,
      pt: `Nas profundezas do reino digital, seu toque revela padrões que ecoam através das câmaras da ${theme}.`,
      ru: `В глубинах цифрового царства ваше прикосновение раскрывает узоры, которые эхом разносятся по залам ${theme}.`,
      ja: `デジタル領域の深みで、あなたの触れが${theme}の部屋を通して響くパターンを明らかにします。`,
      ko: `디지털 영역의 깊이에서 당신의 터치가 ${theme}의 방을 통해 울리는 패턴을 드러냅니다.`,
      zh: `在数字领域的深处，你的触摸揭示了在${theme}殿堂中回响的模式。`
    },

    'mock_response_2': {
      en: `The grid responds to your intention, each click a ripple in the matrix of possibilities.`,
      es: `La cuadrícula responde a tu intención, cada clic una ondulación en la matriz de posibilidades.`,
      fr: `La grille répond à votre intention, chaque clic une ondulation dans la matrice des possibilités.`,
      de: `Das Raster reagiert auf deine Absicht, jeder Klick eine Welle in der Matrix der Möglichkeiten.`,
      it: `La griglia risponde alla tua intenzione, ogni clic un'ondulazione nella matrice delle possibilità.`,
      pt: `A grade responde à sua intenção, cada clique uma ondulação na matriz de possibilidades.`,
      ru: `Сетка отвечает на ваше намерение, каждый клик - волна в матрице возможностей.`,
      ja: `グリッドはあなたの意図に応答し、各クリックが可能性のマトリックスでの波紋です。`,
      ko: `그리드는 당신의 의도에 반응하며, 각 클릭은 가능성의 매트릭스에서의 파문입니다.`,
      zh: `网格回应你的意图，每次点击都是可能性矩阵中的涟漪。`
    },

    'mock_response_3': {
      en: `The ${vaultName.toLowerCase()} holds infinite reflections, each interaction a step deeper into the web of ${theme}.`,
      es: `El ${vaultName.toLowerCase()} contiene reflejos infinitos, cada interacción un paso más profundo en la red de ${theme}.`,
      fr: `Le ${vaultName.toLowerCase()} contient des reflets infinis, chaque interaction un pas plus profond dans le réseau de ${theme}.`,
      de: `Der ${vaultName.toLowerCase()} hält unendliche Reflexionen, jede Interaktion ein Schritt tiefer in das Netzwerk des ${theme}.`,
      it: `Il ${vaultName.toLowerCase()} contiene riflessi infiniti, ogni interazione un passo più profondo nella rete della ${theme}.`,
      pt: `O ${vaultName.toLowerCase()} contém reflexões infinitas, cada interação um passo mais profundo na rede da ${theme}.`,
      ru: `${vaultName} содержит бесконечные отражения, каждое взаимодействие - шаг глубже в сеть ${theme}.`,
      ja: `${vaultName}は無限の反射を保持し、各インタラクションは${theme}のウェブへのより深い一歩です。`,
      ko: `${vaultName}는 무한한 반영을 담고 있으며, 각 상호작용은 ${theme}의 웹으로 더 깊이 들어가는 한 걸음입니다.`,
      zh: `${vaultName}包含无限反射，每次互动都是向${theme}网络更深处迈进的一步。`
    }
  };
};

async function initializeCustomizableContent(customConfig = {}) {
  try {
    console.log('🌍 Initializing customizable multilingual content...');

    // Initialize admin user first
    const adminUser = await initializeAdminUser();

    // Get content with custom configuration
    const multilingualContent = getDefaultContent(customConfig);

    // Initialize content for each language
    for (const [key, translations] of Object.entries(multilingualContent)) {
      for (const [language, content] of Object.entries(translations)) {
        try {
          await languageService.setContent(
            key,
            content,
            getContentType(key),
            language,
            false, // Not protected
            adminUser.id // Created by admin user
          );
          console.log(`✅ Added ${key} in ${language}`);
        } catch (error) {
          console.error(`❌ Error adding ${key} in ${language}:`, error.message);
        }
      }
    }

    console.log('✅ Customizable multilingual content initialized successfully!');
    
    // Show statistics
    const stats = await languageService.getLanguageStats();
    console.log('📊 Language statistics:');
    for (const [lang, count] of Object.entries(stats)) {
      console.log(`   ${lang}: ${count} content items`);
    }

    return { success: true, adminUser, stats };

  } catch (error) {
    console.error('❌ Error initializing customizable content:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to determine content type
function getContentType(key) {
  if (key.includes('animation')) return 'ANIMATION_TEXT';
  if (key.includes('ui_')) return 'UI_TEXT';
  if (key.includes('ai_')) return 'AI_PROMPT';
  if (key.includes('mock_')) return 'MOCK_RESPONSE';
  return 'METADATA';
}

// Example usage with custom configuration
async function initializeWithCustomConfig() {
  const customConfig = {
    characterName: 'GridGuide',
    projectName: 'Interactive Grid',
    theme: 'consciousness',
    vaultName: 'Digital Vault',
    welcomeMessage: 'Welcome to the interactive grid experience'
  };

  return await initializeCustomizableContent(customConfig);
}

// Run if called directly
if (require.main === module) {
  initializeWithCustomConfig();
}

module.exports = { 
  initializeCustomizableContent, 
  initializeWithCustomConfig,
  getDefaultContent 
}; 