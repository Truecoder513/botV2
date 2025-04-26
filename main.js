const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: "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",
});

let groupId;
let groupId2;
let groupParticipant;

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("Scanne le QR code ci-dessus avec WhatsApp.");
});

client.on("ready", async () => {
  console.log("✅ Bot connected and ready!");
  try {
    const chats = await client.getChats();

    const groupConfigs = {
      analyse: {
        name: "Analyse",
        onFound: (group) => {
          groupId2 = group.id._serialized;
          console.log("Analyse group found and configured");
        },
      },
      admin: {
        name: "Admin Manga world😋🔥💉:霧🖤💉",
        onFound: (group) => {
          groupId = group.id._serialized;
          groupParticipant = group.groupMetadata.participants;
          console.log("Admin group found and configured");
        },
      },
    };

    for (const [key, config] of Object.entries(groupConfigs)) {
      const group = chats.find(
        (chat) => chat.isGroup && chat.name === config.name
      );

      if (group) {
        config.onFound(group);
      } else {
        console.log(`Warning: ${key} group not found`);
      }
    }
  } catch (error) {
    console.error("Error during bot initialization:", error);
  }
});

client.on("authenticated", () => {
  console.log("🔐 Authentifié avec succès.");
});

client.on("auth_failure", (msg) => {
  console.error("❌ Échec de l’authentification", msg);
});

client.on("message", async (message) => {
  if (message.from) {
    if (message.from === groupId) {
      if (message.body.toLowerCase() === "#all") {
        if (
          message.body.toLowerCase() === "#all" &&
          groupParticipant.filter(
            (item) => item.id._serialized === message._data?.id?.participant
          )[0]?.isAdmin === true
        ) {
          const chat = await message.getChat();

          let text = "Ohayou min'na, Votre attention est requise.\n\n";
          let mentions = [];

          for (let participant of chat.participants) {
            const contact = await client.getContactById(
              participant.id._serialized
            );

            mentions.push(contact);
            text += `@${participant.id.user}\n`;
          }

          await chat.sendMessage(text, { mentions });
        } else {
          message.reply("C'est une fonctinnalité réservée aux admins");
        }
      } else if (message.body.toLowerCase() === "#programme") {
        const replyMessage = `Lundi : Manga de la Semaine\n\nChoisir un manga spécifique à discuter chaque semaine.\nLes membres peuvent partager leurs impressions, leurs moments préférés et leurs théories sur le manga en cours.\n\nMardi : Art Manga\nLes membres partagent leurs dessins, fan arts ou créations inspirées des mangas ou encore leurs fonds d'écran.\nOrganiser des défis de dessin ou de création en rapport avec un manga populaire.\n\nMercredi : Quiz Manga\nPoser des questions triviales sur les mangas pour tester les connaissances des membres.\nLes membres peuvent répondre et apprendre de nouvelles choses sur leurs séries préférées.\n\nJeudi : Recommandations Manga\nLes membres partagent leurs recommandations de mangas à lire.\nChaque membre peut présenter brièvement un manga qu'il aime et expliquer pourquoi les autres devraient le lire.\n\nVendredi : Cosplay/Vendredi Fou Manga\n Les membres partagent leurs photos de cosplay inspirés de personnages de mangas.\nLes membres peuvent également partager des offres spéciales, des ventes ou des actualités liées aux mangas.\n\nSamedi : Suggestion de Manga\nLes membres proposent des thèmes ou des genres de mangas pour la semaine suivante.\nLe thème le plus populaire est choisi pour le "Manga de la Semaine" du lundi suivant.`;
        message.reply(replyMessage);
      } else if (message.body.toLowerCase() === "#help") {
        const combinedMessage = `Ohayou ! 👋\nJe suis votre bot préféré, ici pour rendre votre expérience dans ce groupe encore plus amusante et interactive. 🤖✨\nVoici les commandes disponibles:\n\n#help / #presentation : Affiche ce message d'aide et de présentation\n\n#programme : Pour obtenir le programme du groupe\n\n#all : Pour mentionner tous les membres du groupe (réservé aux admins)\n\n#fiche_presentation : Pour avoir un exemplaire de la fiche de presentation\n\nParlons de mangas ! Ces livres qui peuvent vous emmener dans des mondes fantastiques plus vite qu'une fusée ! Si vous avez besoin de recommandations ou si vous voulez discuter de vos séries préférées, je suis là pour ça aussi !\n\n\nAlors, asseyez-vous, détendez-vous et préparez-vous à une dose de fun et de blagues, tout en explorant l'univers passionnant des mangas. 📚🎉`;
        message.reply(combinedMessage);
      } else if (message.body.toLowerCase() === "#fiche_presentation") {
        const fiche = `FICHE DE PRÉSENTATION REVISITÉE\n\nI - INFORMATIONS PERSONNELLES\n\n- Nom\n- Prénoms\n- Date et mois de naissance\n- Sexe\n- Nationalité\n- Photo (à dévoiler après avoir rempli la présente fiche)\n- Situation matrimoniale\n- Niveau d'études et/ou activité(s)professionnelle(s)\n- Préférences sexuelles précises (hétéro, homo, LGBT+)\n- Couleur préférée\n\nII - RECAP GEEK\n\n- Animations (animes ou non), mangas et films préférés\n- Animations (animes ou non), mangas et films les moins appréciés\n- Mordu(e) de jeux vidéo ou pas ? Si oui, jeux vidéos préférés\n- Cinq acteurs préférés + Cinq personnages «animes» préférés *\n\nIII - VIE EN COMMUNAUTÉ\n\n
          -Fréquence d’activité (Actif ou Sous-marin)\n-Une citation préférée (Obligatoire)\n- Principale raison de votre présence au sein du F.O.G FANCLUB (Quelles sont les raisons pour lesquelles vous nous avez rejoint ou celles pour lesquelles vous n'avez vu aucun inconvénient à rester dans ce groupe après votre ajout ?)\n\nNB : Aucun détail n'est à négliger(mais remplissez que celle que vous jugez utile, si cela est trop intrusif vous pouvez skip). Cette fiche doit donc être remplie de la plus sérieuse façon possible. Elle valide votre présence parmi nous.\n\nARIGATO !!!`;
        message.reply(fiche);
      } else if (message.body.toLowerCase() === "#momo") {
        message.reply(
          "Faite un dépot à @Black Poète le God Usopp vous le rendra"
        );
      } else if (message.body.toLowerCase() === "#homme_de_reve") {
        message.reply(
          "@Black Poète y'a que toi l'algo ne ment pas j'ai fait toutes les etudes pour cela"
        );
      } else if (message.body.startsWith("#answerMe")) {
        try {
          const question = message.body.slice("#answerMe".length).trim();
          const answer = await iaCaller(question);
          await message.reply(answer);
        } catch (error) {
          console.error("Error processing #answerMe command:", error);
          await message.reply(
            "Désolé j'ai rencontré une erreur réesayer plus tard"
          );
        }
      } else if (
        message.body.startsWith("#") &&
        ![
          "#all",
          "#help",
          "#presentation",
          "#fiche_presentation",
          "#programme",
          "#momo",
          "#homme_de_reve",
        ].includes(message.body.toLowerCase())
      ) {
        message.reply(
          "Commande non valide. Utilisez #help pour obtenir de l'aide."
        );
      }
    } else if (message.from === groupId2) {
      if (message.body.startsWith("#publish")) {
        const targetChat = await client.getChatById(groupId);
        const text = message.body.slice("#publish".length).trim();

        if (text) {
          try {
            let body = "Ohayou min'na, Votre attention est requise.\n\n";
            let mentions = [];

            for (let participant of targetChat.participants) {
              const contact = await client.getContactById(
                participant.id._serialized
              );

              mentions.push(contact);
              body += `@${participant.id.user}`;
            }

            const publication = `${body}\n\n${text}`;

            await targetChat.sendMessage(publication, { mentions });
          } catch (error) {
            console.error("Error in publish command:", error);
            message.reply(
              "An error occurred while publishing the message. Please try again later."
            );
          }
        } else {
          message.reply("Veuillez ajouter un texte après la commande #publish");
        }
      }
    }
  }
});

client.initialize();

// else if (message.body.toLowerCase() === "#japonais") {
//     const randomLesson =
//       japaneseLessons[Math.floor(Math.random() * japaneseLessons.length)];
//     message.reply(
//       `Bienvenue au cours de japonais ! Apprenons quelques expressions utiles :\n\n Phrase : ${randomLesson.phrase}\nSignification : ${randomLesson.meaning}`
//     );
//   }

async function iaCaller(question) {
  const chatCompletion = await getGroqChatCompletion(question);
  return chatCompletion.choices[0]?.message?.content || "";
}

async function getGroqChatCompletion(question) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Tu es un expert de la culture manga, anime, webtoon, comics en gros tu es un geek",
      },
      {
        role: "user",
        content: question,
      },
    ],
    model: "compound-beta",
  });
}
