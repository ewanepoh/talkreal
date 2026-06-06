import React, { useState, useEffect, useRef } from 'react';

const CODES = {'TALKREAL2024':true,'BETA-VIP':true,'BETA-MARIE':true,'BETA-PAUL':true,'BETA-SOFIA':true,'BETA-AHMED':true,'BETA-LUCAS':true,'BETA-SARAH':true,'BETA-YANN':true,'BETA-AISHA':true};

const LEVELS = [
  {id:'zero',     emoji:'🥚', label:'Niveau Zero',     desc:'Je ne connais aucun mot anglais',              color:'#94a3b8', speed:0.65, reps:3},
  {id:'debutant', emoji:'🌱', label:'Debutant',         desc:'Je connais quelques mots: hi, yes, no',        color:'#10b981', speed:0.75, reps:2},
  {id:'scolaire', emoji:'📚', label:'Anglais Scolaire', desc:'Appris a ecole mais pas accent americain',     color:'#3b82f6', speed:0.82, reps:2},
  {id:'inter',    emoji:'🚀', label:'Intermediaire',    desc:'Je comprends mais bloque a oral',              color:'#8b5cf6', speed:0.88, reps:1},
  {id:'avance',   emoji:'🎯', label:'Avance',           desc:'Je parle mais veux sonner americain',          color:'#f59e0b', speed:0.93, reps:1},
  {id:'accent',   emoji:'★',  label:'Accent Parfait',   desc:'Je veux parler comme un natif americain',      color:'#ef4444', speed:0.98, reps:1},
];

const BADGES = [
  {id:'first',   emoji:'🎉', label:'Premiers Pas',     desc:'Terminer ta premiere lecon',   color:'#10b981'},
  {id:'streak3', emoji:'🔥', label:'En Feu',           desc:'3 jours consecutifs',          color:'#f97316'},
  {id:'streak7', emoji:'💎', label:'Une Semaine',      desc:'7 jours consecutifs',          color:'#6366f1'},
  {id:'xp100',   emoji:'⚡', label:'Energique',        desc:'Atteindre 100 XP',             color:'#eab308'},
  {id:'xp500',   emoji:'🏆', label:'Champion',         desc:'Atteindre 500 XP',             color:'#f59e0b'},
  {id:'xp1000',  emoji:'👑', label:'Royaute',          desc:'Atteindre 1000 XP',            color:'#ec4899'},
  {id:'les5',    emoji:'📖', label:'Studieux',         desc:'Completer 5 lecons',           color:'#3b82f6'},
  {id:'les10',   emoji:'🎓', label:'Mi-Parcours',      desc:'Completer 10 lecons',          color:'#8b5cf6'},
  {id:'les20',   emoji:'🌟', label:'Maitre',           desc:'Completer les 20 lecons',      color:'#ef4444'},
  {id:'perfect', emoji:'💯', label:'Parfait',          desc:'100% a un quiz',               color:'#10b981'},
];

const FRIENDS = [
  {name:'Kofi',   xp:1250,streak:12},{name:'Amina',  xp:980, streak:8},
  {name:'Thomas', xp:720, streak:5}, {name:'Fatou',  xp:540, streak:3},
  {name:'Ibrahim',xp:380, streak:6}, {name:'Chloe',  xp:210, streak:2},
];

const CULTURE = [
  {emoji:'🦃', title:'Thanksgiving',   text:'Chaque 4e jeudi de novembre, les Americains mangent de la dinde en famille. Le plus grand repas de famille aux USA !'},
  {emoji:'🏈', title:'Super Bowl',     text:'Le Super Bowl est le match de football americain le plus regarde. Les pubs coutent 7 millions dollars pour 30 secondes !'},
  {emoji:'🍔', title:'Tip Culture',    text:'Aux USA, laisser 15 a 20 pourcent de pourboire est tres important au restaurant. Ne pas laisser de tip est tres mal vu.'},
  {emoji:'☕', title:'Starbucks',      text:'Le prepose ecrit ton prenom sur le verre. Dis toujours ton prenom clairement ! Les americains adorent Starbucks.'},
  {emoji:'😊', title:'Small Talk',     text:'Les Americains font du small talk partout. Dans ascenseur, chez medecin, en file. Repondre avec sourire est attendu !'},
  {emoji:'🎃', title:'Halloween',      text:'Le 31 octobre, des enfants deguises crient Trick or treat pour avoir des bonbons. Tres populaire aux USA !'},
  {emoji:'🗽', title:'Melting Pot',    text:'Les USA sont le melting pot. Une societe avec immigrants du monde entier. Chaque Americain a des origines differentes.'},
  {emoji:'🎓', title:'College Life',   text:'L universite americaine est une experience de vie. Les etudiants habitent sur le campus, font des frats, des sororities.'},
];

const LESSONS = [
  {
    id:1,theme:'Salutations',emoji:'👋',title:'Premier Contact',color:'#ef4444',xp:25,
    sam:'Hey! Today I teach you how real Americans say hello. Forget school English. Listen and repeat!',
    words:[
      {fr:'Hey, quoi de neuf',  en:"Hey, what's up?", ph:'he wots ap',      tip:'Salutation numero 1 aux USA'},
      {fr:'Ca roule',           en:"It's all good!",  ph:'its ol goud',     tip:'Reponse positive — culture americaine'},
      {fr:'Je me presente',     en:"I'm...",          ph:'aim',             tip:'My name is trop scolaire'},
      {fr:'Enchante',           en:'Nice to meet you',ph:'nais tou mit you',tip:'Avec grand sourire — obligatoire !'},
      {fr:'A plus',             en:'Later!',          ph:'lei-ter',         tip:'Ou See ya — jamais Goodbye'},
    ],
    ex:[
      {t:'fill',  q:'Hey, ___ up?',               a:"what's",           h:'wots'},
      {t:'fill',  q:"It's all ___!",              a:'good',             h:'goud'},
      {t:'pick',  q:'Comment dire Enchante ?',    a:'Nice to meet you', o:['Nice to meet you','Good to see you','Happy meeting','Glad hello']},
      {t:'trans', q:'Je me presente Marie',       a:"I'm Marie",        h:'aim Marie'},
      {t:'pick',  q:'Comment dire A plus ?',      a:'Later!',           o:['Goodbye!','Later!','Farewell!','See you!']},
    ],
  },
  {
    id:2,theme:'Salutations',emoji:'🤝',title:'Faire Connaissance',color:'#ef4444',xp:25,
    sam:'Round 2 on greetings! Now you learn how Americans do small talk and introductions.',
    words:[
      {fr:'Tu viens de quel pays',     en:'Where are you from?',        ph:'wer ar you from',      tip:'Question classique en Amerique'},
      {fr:'Je viens de France',        en:"I'm from France",            ph:'aim from Frans',        tip:'Simple et direct'},
      {fr:'Tu fais quoi dans la vie',  en:'What do you do?',            ph:'wot dou you dou',       tip:'Pour demander le metier'},
      {fr:'Ca fait longtemps que tu es la', en:'How long have you been here?', ph:'hao long hav you bin hier', tip:'Pour connaitre quelqu un'},
      {fr:'On devrait se revoir',      en:'We should hang out!',        ph:'wi shoud hang aout',    tip:'Hang out = passer du temps ensemble'},
    ],
    ex:[
      {t:'trans', q:'Tu viens de quel pays',      a:'Where are you from?',h:'wer ar you from'},
      {t:'fill',  q:"I'm ___ France",             a:'from',              h:'from'},
      {t:'pick',  q:'What do you do signifie',    a:'Quel est ton metier',o:['Que fais-tu','Quel est ton metier','Comment tu vas','Que veux-tu']},
      {t:'fill',  q:'We should ___ out!',         a:'hang',              h:'hang'},
      {t:'trans', q:'Je viens de France',         a:"I'm from France",   h:'aim from Frans'},
    ],
  },
  {
    id:3,theme:'Cafe',emoji:'☕',title:'Chez Starbucks',color:'#10b981',xp:30,
    sam:"You're in New York at Starbucks. Say Can I get — never I would like. Too formal!",
    words:[
      {fr:'Un cafe sil vous plait', en:'Can I get a coffee?', ph:'kan ai guet a kofi',  tip:'Can I get = formule magique US'},
      {fr:'Pour emporter',          en:'To go',               ph:'tou goh',             tip:'Pas take away — British !'},
      {fr:'Combien ca coute',       en:'How much?',           ph:'hao match',           tip:'Simple et direct'},
      {fr:'Gardez la monnaie',      en:'Keep the change',     ph:'kip ze tcheinj',      tip:'Pourboire important aux USA'},
      {fr:'Tres delicieux',         en:'So good!',            ph:'soh goud',            tip:'Les Americains exagerent toujours'},
    ],
    ex:[
      {t:'pick',  q:'Pour commander aux USA tu dis',   a:'Can I get a coffee?', o:['I would like coffee','Can I get a coffee?','Give me coffee','Coffee please']},
      {t:'fill',  q:'___ go (pour emporter)',          a:'To',                  h:'tou'},
      {t:'trans', q:'Combien ca coute',                a:'How much?',           h:'hao match'},
      {t:'fill',  q:'Keep the ___',                   a:'change',              h:'tcheinj'},
      {t:'pick',  q:'Tres delicieux en americain',    a:'So good!',            o:['Very delicious!','So good!','It tastes well!','Yummy!']},
    ],
  },
  {
    id:4,theme:'Cafe',emoji:'🍽️',title:'Au Restaurant',color:'#10b981',xp:30,
    sam:"You're at a restaurant in Miami. American restaurants are casual. Here is what you need!",
    words:[
      {fr:'On est prets a commander',      en:"We're ready to order",     ph:'wir redi tou order',  tip:'Pour appeler le serveur'},
      {fr:'Que recommandez vous',          en:'What do you recommend?',   ph:'wot dou you rekomend',tip:'Question frequente en Amerique'},
      {fr:'Je prends ca',                  en:"I'll have that",           ph:'ail hav dat',         tip:'Naturel pour commander'},
      {fr:'Excellent repas',               en:'That was amazing',         ph:'dat woz ameizing',    tip:'Les Americains utilisent superlatifs'},
      {fr:'Addition sil vous plait',       en:'Check, please!',           ph:'tchek pliz',          tip:'Bill c est British — dis Check'},
    ],
    ex:[
      {t:'trans', q:'On est prets a commander',    a:"We're ready to order", h:'wir redi tou order'},
      {t:'fill',  q:"I'll ___ that",               a:'have',                 h:'hav'},
      {t:'pick',  q:'Comment demander addition',   a:'Check, please!',       o:['Bill please!','Money now!','Check, please!','Pay time!']},
      {t:'trans', q:'Excellent repas',              a:'That was amazing',     h:'dat woz ameizing'},
      {t:'fill',  q:'What do you ___?',            a:'recommend',            h:'rekomend'},
    ],
  },
  {
    id:5,theme:'Transport',emoji:'🚗',title:'Dans un Uber',color:'#8b5cf6',xp:30,
    sam:"You're in an Uber in LA. Americans love friendly and direct people. Here is what to say!",
    words:[
      {fr:'Vous etes mon chauffeur',  en:'Are you my driver?',   ph:'ar you mai draiver', tip:'Toujours confirmer'},
      {fr:'Tout droit',               en:'Straight ahead',       ph:'streit a-hed',       tip:'Simple et clair'},
      {fr:'Tournez a gauche',         en:'Turn left',            ph:'tern left',          tip:'Court et efficace'},
      {fr:'Arretez vous ici',         en:'Right here',           ph:'rait hier',          tip:'Pour arreter le chauffeur'},
      {fr:'Merci pour la course',     en:'Thanks for the ride!', ph:'thenks for ze raid', tip:'Sourire + ces mots = 5 etoiles !'},
    ],
    ex:[
      {t:'trans', q:'Vous etes mon chauffeur',  a:'Are you my driver?',   h:'ar you mai draiver'},
      {t:'pick',  q:'Comment dire tout droit',  a:'Straight ahead',       o:['Go forward','Straight ahead','Direct please','Continue road']},
      {t:'fill',  q:'Turn ___',                 a:'left',                 h:'left'},
      {t:'fill',  q:'___ here',                a:'Right',                h:'rait'},
      {t:'trans', q:'Merci pour la course',     a:'Thanks for the ride!', h:'thenks for ze raid'},
    ],
  },
  {
    id:6,theme:'Transport',emoji:'✈️',title:'Aeroport',color:'#8b5cf6',xp:30,
    sam:"You're at JFK airport in New York. Customs, check-in, boarding — I teach you everything!",
    words:[
      {fr:'Ou est enregistrement',     en:'Where is check-in?',    ph:'wer iz tchek-in',     tip:'Premiere question aeroport'},
      {fr:'Mon vol pour Paris',        en:'I have a flight to Paris',ph:'ai hav a flait tou Paris',tip:'Simple pour se reperer'},
      {fr:'Affaires ou tourisme',      en:'Business or pleasure?',  ph:'biznes or plejer',    tip:'Question des douanes americaines'},
      {fr:'Rien a declarer',           en:'Nothing to declare',     ph:'nathing tou dekler',  tip:'Essentiel aux douanes'},
      {fr:'Ou est la porte',           en:'Where is the gate?',     ph:'wer iz ze geit',      tip:'Gate = porte embarquement'},
    ],
    ex:[
      {t:'trans', q:'Ou est enregistrement',   a:'Where is check-in?',  h:'wer iz tchek-in'},
      {t:'fill',  q:'I have a ___ to Paris',   a:'flight',              h:'flait'},
      {t:'pick',  q:'Business or pleasure signifie', a:'Affaires ou tourisme',o:['Travail ou plaisir','Affaires ou tourisme','Premiere ou economy','Seul ou en famille']},
      {t:'fill',  q:'Nothing to ___',          a:'declare',             h:'dekler'},
      {t:'trans', q:'Ou est la porte',          a:'Where is the gate?',  h:'wer iz ze geit'},
    ],
  },
  {
    id:7,theme:'Travail',emoji:'💼',title:'Au Bureau',color:'#0ea5e9',xp:35,
    sam:"You're in an American company. These 5 phrases will make you sound like a total pro!",
    words:[
      {fr:'On fait le point',         en:'Can we catch up?',      ph:'kan wi katch ap',    tip:'Catch up = se mettre a jour'},
      {fr:'Je te tiens informe',      en:"I'll keep you posted",  ph:'ail kip you pohsted',tip:'Phrase cle en milieu pro US'},
      {fr:'Je gere ca',               en:"I'm on it",             ph:'aim on it',          tip:'Montre que tu prends en charge'},
      {fr:'Bien recu',                en:'Got it!',               ph:'got it',             tip:'Pour confirmer un message'},
      {fr:'Excellent travail',        en:'Great job!',            ph:'greit djob',         tip:'Les Americains complimentent souvent'},
    ],
    ex:[
      {t:'trans', q:'On fait le point',      a:'Can we catch up?',    h:'kan wi katch ap'},
      {t:'fill',  q:"I'm ___ it",            a:'on',                  h:'on'},
      {t:'pick',  q:'Confirmer un message',  a:'Got it!',             o:['Message received!','I understand!','Got it!','Confirmed!']},
      {t:'fill',  q:"I'll keep you ___",     a:'posted',              h:'pohsted'},
      {t:'trans', q:'Excellent travail',     a:'Great job!',          h:'greit djob'},
    ],
  },
  {
    id:8,theme:'Travail',emoji:'🤝',title:'En Reunion',color:'#0ea5e9',xp:35,
    sam:"You're in a meeting with Americans. These phrases will make you shine professionally!",
    words:[
      {fr:'Pour resumer',              en:'To recap...',              ph:'tou ri-kap',          tip:'Pour resumer ce qui a ete dit'},
      {fr:'Je voulais aborder',        en:'I wanted to bring up...',  ph:'ai wonted tou bring ap',tip:'Pour introduire un sujet'},
      {fr:'Tout le monde est ok',      en:'Is everyone on board?',    ph:'iz evriwane on bord',  tip:'Pour verifier le consensus'},
      {fr:'On se revoit quand',        en:'When should we follow up?',ph:'wen shoud wi foloh ap', tip:'Follow up = donner suite'},
      {fr:'Je gere ce point',          en:"I'll handle it",           ph:'ail handel it',        tip:'Pour prendre une responsabilite'},
    ],
    ex:[
      {t:'fill',  q:'To ___... (pour resumer)',        a:'recap',           h:'ri-kap'},
      {t:'trans', q:'Je voulais aborder ce sujet',     a:'I wanted to bring up...',h:'ai wonted tou bring ap'},
      {t:'pick',  q:'On board dans contexte pro',      a:'D accord et partant',o:['Dans le bateau','D accord et partant','Embarque','A bord']},
      {t:'fill',  q:'When should we follow ___?',      a:'up',              h:'ap'},
      {t:'trans', q:'Je gere ce point',                a:"I'll handle it",  h:'ail handel it'},
    ],
  },
  {
    id:9,theme:'Series',emoji:'🎬',title:'Phrases de Series',color:'#f59e0b',xp:35,
    sam:"My favorite! These phrases are in Friends, Breaking Bad, Stranger Things — ALL the time!",
    words:[
      {fr:'Tu plaisantes',         en:'Are you kidding me?', ph:'ar you kid-ing mi',  tip:'Surprise ou incredulite'},
      {fr:'Laisse tomber',         en:'Never mind',          ph:'ne-ver maind',       tip:'Pour clore un sujet'},
      {fr:'Impossible',            en:'No way!',             ph:'noh wei',            tip:'Surprise positive OU negative'},
      {fr:'Je ne sais pas',        en:'I have no idea',      ph:'ai hav noh ai-dia',  tip:'Plus naturel que I dont know'},
      {fr:'Vraiment fou',          en:"That's crazy!",       ph:'dats krei-zi',       tip:'Positif ou negatif selon contexte'},
    ],
    ex:[
      {t:'pick',  q:'Tu es surpris tu dis',       a:'Are you kidding me?', o:['Really true?','Are you kidding me?','Is this real?','No seriously?']},
      {t:'fill',  q:'Never ___',                  a:'mind',                h:'maind'},
      {t:'trans', q:'Impossible',                  a:'No way!',             h:'noh wei'},
      {t:'pick',  q:'Je ne sais pas en naturel',  a:'I have no idea',      o:['I dont know nothing','I have no idea','I know not','No idea have I']},
      {t:'fill',  q:"That's ___!",               a:'crazy',               h:'krei-zi'},
    ],
  },
  {
    id:10,theme:'Series',emoji:'🎮',title:'Pop Culture US',color:'#f59e0b',xp:35,
    sam:"Sports, gaming, movies — Americans talk about pop culture ALL the time. You need this!",
    words:[
      {fr:'Moment decisif',           en:"It's game time!",      ph:'its geim taim',       tip:'Game time = moment decisif'},
      {fr:'Il excelle',               en:"He's killing it!",     ph:'hiz kil-ing it',      tip:'Killing it = exceller'},
      {fr:'Je regarde tout en serie', en:"I'm binge-watching it",ph:'aim bindj-watching it',tip:'Regarder toute une serie en un coup'},
      {fr:'Tu reveles la fin',        en:"That's a spoiler!",    ph:'dats a spoil-er',     tip:'Reveler la fin — interdit !'},
      {fr:'Chair de poule',           en:'It gave me goosebumps',ph:'it geiv mi gous-bamps',tip:'Goosebumps = chair de poule'},
    ],
    ex:[
      {t:'fill',  q:"It's ___ time!",            a:'game',               h:'geim'},
      {t:'trans', q:'Il excelle',                 a:"He's killing it!",   h:'hiz kiling it'},
      {t:'pick',  q:'Binge-watching signifie',    a:'Regarder toute une serie en un coup',o:['Regarder a deux','Regarder toute une serie en un coup','Regarder vite','Regarder en avance']},
      {t:'fill',  q:"That's a ___!",             a:'spoiler',            h:'spoil-er'},
      {t:'trans', q:'Chair de poule',             a:'It gave me goosebumps',h:'it geiv mi gous-bamps'},
    ],
  },
  {
    id:11,theme:'Slang',emoji:'🔥',title:'Vrai Slang US',color:'#ec4899',xp:40,
    sam:"The English they DON'T teach you in school! Real Americans use these every single day!",
    words:[
      {fr:'Incroyable',           en:"That's fire!",    ph:'dats faier',  tip:'Fire = excellent — utilise partout'},
      {fr:'Je mens pas',          en:'No cap',          ph:'noh kap',     tip:'No cap = for real, sans mentir'},
      {fr:'Exactement',           en:'Facts',           ph:'fakts',       tip:'Facts tout seul pour approuver'},
      {fr:'Je suis la pour toi',  en:'I got you',       ph:'ai got you',  tip:'Je te soutiens, tu peux compter sur moi'},
      {fr:'Vraiment fou',         en:"That's wild!",    ph:'dats waild',  tip:'Pour quelque chose de surprenant'},
    ],
    ex:[
      {t:'pick',  q:'Incroyable en slang US',    a:"That's fire!", o:["That's very good!","That's fire!",'Wow amazing!','Super great!']},
      {t:'fill',  q:'___ (pour dire exactement)',a:'Facts',        h:'fakts'},
      {t:'trans', q:'Je suis la pour toi',       a:'I got you',    h:'ai got you'},
      {t:'fill',  q:"That's ___! (vraiment fou)",a:'wild',         h:'waild'},
      {t:'pick',  q:'No cap signifie',           a:'Sans mentir',  o:['Pas de chapeau','Sans mentir','Aucun probleme','Gratuit']},
    ],
  },
  {
    id:12,theme:'Slang',emoji:'💅',title:'Gen Z Americain',color:'#ec4899',xp:40,
    sam:"The newest slang! The words Gen Z Americans use RIGHT NOW in 2024. Super trendy!",
    words:[
      {fr:'Un peu cool',         en:"It's lowkey fire",    ph:'its lohki faier',  tip:'Lowkey = un peu, discretement'},
      {fr:'Trop dramatique',     en:'Being extra',         ph:'bi-ing extra',     tip:'Extra = exagere, theatral'},
      {fr:'Authentique',         en:"That's real",         ph:'dats riel',        tip:'Pour valider quelque chose de vrai'},
      {fr:'Bonne ambiance',      en:"They're a vibe",      ph:'their a vaib',     tip:'Vibe = energie positive'},
      {fr:'Passe a la suite',    en:'Move on',             ph:'mouv on',          tip:'Tres utilise pour avancer'},
    ],
    ex:[
      {t:'pick',  q:'Being extra signifie',       a:'Exagerer et theatraliser',o:['Etre en plus','Exagerer et theatraliser','Avoir plus','Faire extra']},
      {t:'fill',  q:"They're a ___",              a:'vibe',                    h:'vaib'},
      {t:'trans', q:'Passe a la suite',            a:'Move on',                 h:'mouv on'},
      {t:'fill',  q:"It's lowkey ___",            a:'fire',                    h:'faier'},
      {t:'pick',  q:"That's real en slang Gen Z", a:'Authentique et vrai',     o:["C'est reel",'Authentique et vrai','La realite','Vrai']},
    ],
  },
  {
    id:13,theme:'Emotions',emoji:'😄',title:'Les Emotions',color:'#f97316',xp:35,
    sam:"Americans are VERY expressive! They say I am SO pumped! Not just I am happy. Big energy!",
    words:[
      {fr:'Je suis super content',   en:"I'm stoked!",         ph:'aim stohkt',       tip:'Stoked = tres excite — typiquement americain'},
      {fr:'Je suis fatigue',         en:"I'm beat",            ph:'aim bit',          tip:'Plus naturel que I am tired'},
      {fr:'Ca me met hors de moi',   en:'That ticks me off!',  ph:'dat tiks mi of',   tip:'Expression imagee tres courante'},
      {fr:'Je suis triste',          en:"I'm down",            ph:'aim daoun',        tip:'I am down plus naturel que I am sad'},
      {fr:'Je suis aux anges',       en:"I'm over the moon!",  ph:'aim ohver ze moun',tip:'Pour la joie extreme — tres americain'},
    ],
    ex:[
      {t:'pick',  q:'Je suis super content americain', a:"I'm stoked!",   o:["I'm very happy!","I'm stoked!","I am joyful!","I feel good!"]},
      {t:'fill',  q:"I'm ___ (fatigue)",               a:'beat',          h:'bit'},
      {t:'trans', q:'Je suis triste',                   a:"I'm down",      h:'aim daoun'},
      {t:'fill',  q:"I'm over the ___!",               a:'moon',          h:'moun'},
      {t:'trans', q:'Ca me met hors de moi',            a:'That ticks me off!',h:'dat tiks mi of'},
    ],
  },
  {
    id:14,theme:'Emotions',emoji:'💪',title:'Encouragements',color:'#f97316',xp:35,
    sam:"Americans are masters at motivating each other. Learn these and people will love you!",
    words:[
      {fr:'Tu vas y arriver',        en:'You got this!',          ph:'you got dis',         tip:'Phrase de motivation numero 1 en Amerique'},
      {fr:'Je crois en toi',         en:'I believe in you',       ph:'ai biliv in you',     tip:'Puissant et sincere'},
      {fr:'Inquiete toi pas',        en:"Don't sweat it",         ph:'dont swet it',        tip:'Sweat = suer — ne t en fais pas'},
      {fr:'Ton moment est venu',     en:'This is your time!',     ph:'dis iz yor taim',     tip:'Pour encourager avant grand moment'},
      {fr:'Tu geres vraiment',       en:"You're crushing it!",    ph:'yor krashing it',     tip:'Crushing it = etre en train d exceller'},
    ],
    ex:[
      {t:'trans', q:'Tu vas y arriver',          a:'You got this!',        h:'you got dis'},
      {t:'fill',  q:'I ___ in you',              a:'believe',              h:'biliv'},
      {t:'pick',  q:"Don't sweat it signifie",   a:'Ne t inquiete pas',    o:["Ne transpire pas","Ne t inquiete pas","Ne pleure pas","Ca ira"]},
      {t:'fill',  q:'This is your ___!',         a:'time',                 h:'taim'},
      {t:'trans', q:'Tu geres vraiment',          a:"You're crushing it!",  h:'yor krashing it'},
    ],
  },
  {
    id:15,theme:'Prononc',emoji:'🗣️',title:'Sons Americains',color:'#6366f1',xp:40,
    sam:"This lesson is SUPER important. The 5 sounds that transform your accent completely!",
    words:[
      {fr:'T qui devient D',    en:'Water = Wah-der',    ph:'woh-der',   tip:'T entre voyelles sonne comme D en americain'},
      {fr:'Son TH',             en:'Think = Thinnk',     ph:'thinnk',    tip:'Pose la langue entre les dents et souffle'},
      {fr:'R americain',        en:'Really = Rilly',     ph:'rili',      tip:'Le R vient du fond de la gorge'},
      {fr:'Gonna et Wanna',     en:'Going to = Gonna',   ph:'gon-na',    tip:'Going to devient toujours gonna a oral'},
      {fr:'Reduction you',      en:'See you = See ya',   ph:'si ya',     tip:'Les Americains avalent les sons'},
    ],
    ex:[
      {t:'pick',  q:"Americain prononce water",  a:'Woh-der',              o:['Wah-ter','Woh-der','Vater','Wouater']},
      {t:'pick',  q:'Son TH dans think',         a:'Langue entre les dents',o:['Un S francais','Un Z','Langue entre les dents','Un T dur']},
      {t:'pick',  q:'Going to a oral devient',   a:'Gonna',               o:['Going to','Go to','Gonna','Goin']},
      {t:'fill',  q:'See ___ (a plus)',           a:'ya',                  h:'ya'},
      {t:'pick',  q:'R americain vient de',       a:'Fond de la gorge',    o:['Bout des levres','Fond de la gorge','Les dents','Le nez']},
    ],
  },
  {
    id:16,theme:'Prononc',emoji:'🎵',title:'Rythme Melodie',color:'#6366f1',xp:40,
    sam:"English has a rhythm! Americans speak with a melody. I teach you to sound natural and fluid!",
    words:[
      {fr:'Contractions orales',   en:"I'm gonna do it",      ph:'aim gona dou it',   tip:'Gonna = going to — toujours a oral'},
      {fr:'Accent americain',      en:'I LOVE New York',      ph:'ai LAV nyou york',  tip:'Les Americains accentuent fortement'},
      {fr:'Enchainement de mots',  en:'Whaddya want?',        ph:'wod-ya wont',       tip:'What do you devient whaddya rapide'},
      {fr:'Ton montant fin',       en:'Really? — ton montant',ph:'rili montant',      tip:'Les Americains montent voix pour surprise'},
      {fr:'Mots de remplissage',   en:'Like... you know...',  ph:'laik... you noh...',tip:'Like est mot le plus parle en anglais US'},
    ],
    ex:[
      {t:'pick',  q:"I'm gonna signifie",          a:"I'm going to",       o:["I am gonna","I'm going to","I will go","I'm going"]},
      {t:'fill',  q:"Whaddya want vient de What ___ you want", a:'do', h:'dou'},
      {t:'pick',  q:"L accentuation americaine",    a:'Accentue les mots importants',o:['Tout egal','Accentue les mots importants','Murmure','Parle vite']},
      {t:'fill',  q:'___ you know... (remplissage)',a:'Like',              h:'laik'},
      {t:'pick',  q:'Ton montant en fin de phrase', a:'Question ou surprise',o:['Colere','Question ou surprise','Joie','Doute']},
    ],
  },
  {
    id:17,theme:'Convers',emoji:'💬',title:'Parler Naturel',color:'#14b8a6',xp:45,
    sam:"Lesson 17 — you are becoming a real speaker! These automatic phrases flow naturally.",
    words:[
      {fr:'Honnetement',              en:'Honestly...',             ph:'on-es-tli',       tip:'Pour introduire opinion sincere'},
      {fr:'Tu vois ce que je veux dire', en:'You know what I mean?',ph:'you noh wot ai min',tip:'Les Americains disent ca tout le temps'},
      {fr:'Euh pour reflechir',       en:'I mean...',               ph:'ai min',          tip:'Pour gagner du temps naturellement'},
      {fr:'Absolument',               en:'Totally!',                ph:'toh-tali',        tip:'Bien plus americain que Yes absolutely'},
      {fr:'Tres bonne idee',          en:'Sounds good!',            ph:'saoundz goud',    tip:'Pour accepter une proposition'},
    ],
    ex:[
      {t:'trans', q:'Honnetement',                    a:'Honestly...',          h:'on-es-tli'},
      {t:'fill',  q:'You know what I ___?',           a:'mean',                 h:'min'},
      {t:'pick',  q:'Tres bonne idee',                a:'Sounds good!',         o:['Looks well!','Sounds good!','Seems nice!','Appears okay!']},
      {t:'fill',  q:'___! (absolument)',              a:'Totally',              h:'toh-tali'},
      {t:'trans', q:'Tu vois ce que je veux dire',    a:'You know what I mean?',h:'you noh wot ai min'},
    ],
  },
  {
    id:18,theme:'Convers',emoji:'🗽',title:'Culture US',color:'#14b8a6',xp:45,
    sam:"To truly speak American, you need to know American culture. These references will help you blend in!",
    words:[
      {fr:'C est gagne',             en:"It's in the bag",         ph:'its in ze bag',       tip:'Signifie que c est gagne d avance'},
      {fr:'Moment de verite',        en:"It's game time",          ph:'its geim taim',       tip:'Reference sportive — tres americaine'},
      {fr:'Revenir essentiel',       en:'Back to basics',          ph:'bak tou bei-siks',    tip:'Tres utilise en business americain'},
      {fr:'Essayer quelque chose',   en:'Give it a shot',          ph:'giv it a shot',       tip:'Shot = tentative'},
      {fr:'Ca part dans tous sens',  en:"It's all over the place", ph:'its ol oh-ver ze pleis',tip:'Pour dire que c est desorganise'},
    ],
    ex:[
      {t:'trans', q:'C est gagne',                  a:"It's in the bag",     h:'its in ze bag'},
      {t:'fill',  q:'Back to ___',                  a:'basics',              h:'bei-siks'},
      {t:'pick',  q:'Give it a shot signifie',       a:'Essaie-le',           o:['Tire dessus','Essaie-le','Donne un coup','Lance-le']},
      {t:'fill',  q:"It's all over the ___",        a:'place',               h:'pleis'},
      {t:'trans', q:'Moment de verite',              a:"It's game time",      h:'its geim taim'},
    ],
  },
  {
    id:19,theme:'Accent',emoji:'★',title:'Sonner Natif',color:'#ef4444',xp:50,
    sam:"This is elite level! The last 5 percent that separates good English from PERFECT English!",
    words:[
      {fr:'Contractions fluides',   en:'Gonna, Wanna, Gotta',   ph:'gona wona gota',    tip:'Going to, want to, got to — contracte toujours'},
      {fr:'Ton decontracte',        en:'Yeah, for sure',         ph:'ye for shor',       tip:'Le ton americain naturel'},
      {fr:'Reduire him et her',     en:"Tell 'im, Ask 'er",      ph:'tel-im ask-er',     tip:'Him devient im, her devient er a oral rapide'},
      {fr:'Accentuer emotions',     en:'I LOVE that!',           ph:'ai LAV dat',        tip:'Les Americains accentuent mots emotionnels'},
      {fr:'Pause naturelle',        en:'So... yeah...',          ph:'soh... ye...',      tip:'Pour rendre anglais plus naturel et humain'},
    ],
    ex:[
      {t:'pick',  q:'Gonna vient de',              a:'Going to',            o:['Go now','Going to','Gonna go','I go']},
      {t:'fill',  q:'Yeah, for ___',               a:'sure',                h:'shor'},
      {t:'pick',  q:"Tell 'im c est quoi",         a:'Tell him',            o:["Tell I'm",'Tell him','Tell them','Tell me']},
      {t:'fill',  q:'I ___ that! (fort)',           a:'LOVE',                h:'LAV'},
      {t:'pick',  q:'Pourquoi dire So yeah',        a:'Parler plus naturellement',o:['Gagner du temps','Parler plus naturellement','Etre poli','Stresser']},
    ],
  },
  {
    id:20,theme:'Accent',emoji:'👑',title:'Maitre Anglais US',color:'#ef4444',xp:60,
    sam:"FINAL LESSON! You made it to lesson 20. The ultimate American conversation. YOU are ready!",
    words:[
      {fr:'Je suis totalement d accord', en:"I couldn't agree more",  ph:'ai koudnt agri more',tip:'Plus fort que I agree'},
      {fr:'Exactement juste',             en:'Exactly! Spot on!',      ph:'egzaktli spot on',   tip:'Spot on = parfaitement juste'},
      {fr:'Ca me depasse',                en:"It's beyond me",         ph:'its bi-yond mi',     tip:'Pour dire qu on ne comprend pas'},
      {fr:'C est le point cle',           en:"That's the thing",       ph:'dats ze thing',      tip:'Pour confirmer l essentiel'},
      {fr:'Pour etre honnete',            en:'Not gonna lie...',       ph:'not gona lai',       tip:'Pour introduire quelque chose sincere'},
    ],
    ex:[
      {t:'trans', q:'Je suis totalement d accord', a:"I couldn't agree more", h:'ai koudnt agri more'},
      {t:'fill',  q:'Exactly! Spot ___!',          a:'on',                    h:'on'},
      {t:'pick',  q:"It's beyond me signifie",     a:'Ca me depasse',         o:["C est derriere moi",'Ca me depasse',"C est trop loin","Au-dela de moi"]},
      {t:'fill',  q:"That's the ___",             a:'thing',                 h:'thing'},
      {t:'trans', q:'Pour etre honnete',            a:'Not gonna lie...',      h:'not gona lai'},
    ],
  },
];

const XP_LVS = [
  {name:'Zero',     emoji:'🥚',color:'#94a3b8',min:0},
  {name:'Touriste', emoji:'🧳',color:'#10b981',min:100},
  {name:'Voyageur', emoji:'✈️',color:'#3b82f6',min:300},
  {name:'Resident', emoji:'🏠',color:'#8b5cf6',min:700},
  {name:'Local',    emoji:'🗽',color:'#f59e0b',min:1300},
  {name:'Americain',emoji:'★', color:'#ef4444',min:2000},
];

function getXL(xp){let l=XP_LVS[0];for(const v of XP_LVS){if(xp>=v.min)l=v;}return l;}
function getNX(xp){for(let i=XP_LVS.length-1;i>=0;i--){if(xp>=XP_LVS[i].min)return XP_LVS[Math.min(i+1,XP_LVS.length-1)];}return XP_LVS[1];}

function getBadges(user,done){
  const b=[];
  if(done.length>=1)b.push('first');
  if(user.streak>=3)b.push('streak3');
  if(user.streak>=7)b.push('streak7');
  if(user.xp>=100)b.push('xp100');
  if(user.xp>=500)b.push('xp500');
  if(user.xp>=1000)b.push('xp1000');
  if(done.length>=5)b.push('les5');
  if(done.length>=10)b.push('les10');
  if(done.length>=20)b.push('les20');
  return b;
}

function speak(text,speed,onEnd){
  if(!window.speechSynthesis){if(onEnd)onEnd();return;}
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang='en-US';u.rate=speed||0.85;
  if(onEnd)u.onend=onEnd;
  window.speechSynthesis.speak(u);
}

function tone(ok){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    if(ok){
      [520,780,1040].forEach((f,i)=>{
        const o=ctx.createOscillator(),g=ctx.createGain();
        o.connect(g);g.connect(ctx.destination);
        o.frequency.value=f;g.gain.setValueAtTime(0.2,ctx.currentTime+i*0.12);
        g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.12+0.3);
        o.start(ctx.currentTime+i*0.12);o.stop(ctx.currentTime+i*0.12+0.35);
      });
    }else{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);
      o.frequency.setValueAtTime(280,ctx.currentTime);
      o.frequency.setValueAtTime(200,ctx.currentTime+0.15);
      g.gain.setValueAtTime(0.2,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.4);
      o.start();o.stop(ctx.currentTime+0.4);
    }
  }catch(e){}
}

function jingle(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    [440,554,659,880,1108].forEach((f,i)=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);
      o.frequency.value=f;
      g.gain.setValueAtTime(0,ctx.currentTime+i*0.14);
      g.gain.linearRampToValueAtTime(0.18,ctx.currentTime+i*0.14+0.05);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.14+0.32);
      o.start(ctx.currentTime+i*0.14);o.stop(ctx.currentTime+i*0.14+0.38);
    });
  }catch(e){}
}

function shuffle(a){return[...a].sort(()=>Math.random()-0.5);}
function rnd(a){return a[Math.floor(Math.random()*a.length)];}
const WIN=['Perfect! Exactly right!','Yes!! You sound American!','Amazing! Keep going!','Excellent! I am proud of you!'];
const TRY=["Not quite — but you are close!",'Almost! Listen one more time.','Keep going — you got this!'];
const BB={flex:1,background:'#f1f5f9',border:'none',borderRadius:'13px',padding:'12px',fontSize:'13px',fontWeight:700,cursor:'pointer'};

function BackBtn({onClick}){return React.createElement('button',{onClick,style:{background:'none',border:'none',color:'#94a3b8',fontSize:'14px',cursor:'pointer',padding:0}},'← Retour');}

function Access({onDone}){
  const [code,setCode]=useState('');
  const [err,setErr]=useState('');
  const sub=()=>{
    if(CODES[code.trim().toUpperCase()])onDone();
    else{setErr('Code invalide. Verifie ton invitation.');setCode('');}
  };
  return React.createElement('div',{style:{minHeight:'100vh',background:'linear-gradient(135deg,#0a0a14,#0f172a)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px 20px',gap:'16px',textAlign:'center'}},
    React.createElement('div',{style:{fontSize:'68px',lineHeight:1}},'🎙️'),
    React.createElement('h1',{style:{color:'#fff',fontSize:'44px',fontWeight:900,letterSpacing:'-2px',margin:0}},'TalkReal'),
    React.createElement('p',{style:{color:'#ef4444',fontSize:'11px',fontWeight:700,letterSpacing:'4px',textTransform:'uppercase',margin:0}},'AVEC PROF SAM'),
    React.createElement('p',{style:{color:'#334155',fontSize:'13px',lineHeight:1.7,margin:'4px 0 12px'}},'Ton coach americain personnel.'),
    React.createElement('div',{style:{background:'rgba(255,255,255,0.03)',borderRadius:'24px',padding:'28px 22px',width:'100%',maxWidth:'340px',border:'1px solid rgba(255,255,255,0.08)'}},
      React.createElement('p',{style:{color:'#475569',fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',margin:'0 0 10px'}},'Code acces beta'),
      React.createElement('input',{value:code,onChange:e=>{setCode(e.target.value.toUpperCase());setErr('');},onKeyDown:e=>e.key==='Enter'&&sub(),placeholder:'Ex: TALKREAL2024',style:{width:'100%',padding:'14px',fontSize:'17px',fontWeight:800,borderRadius:'12px',border:err?'2px solid #ef4444':'2px solid rgba(255,255,255,0.08)',background:'rgba(0,0,0,0.4)',color:'#fff',outline:'none',letterSpacing:'3px',textAlign:'center',boxSizing:'border-box',marginBottom:'8px'}}),
      err&&React.createElement('p',{style:{color:'#ef4444',fontSize:'12px',margin:'0 0 8px'}},err),
      React.createElement('button',{onClick:sub,style:{width:'100%',padding:'15px',background:'linear-gradient(135deg,#ef4444,#ec4899)',color:'#fff',border:'none',borderRadius:'12px',fontSize:'15px',fontWeight:800,cursor:'pointer'}},'Entrer dans TalkReal →')
    )
  );
}

function Onboard({onDone}){
  const [step,setStep]=useState(0);
  const [name,setName]=useState('');
  const [age,setAge]=useState('');
  const [level,setLevel]=useState(null);
  const pick=(lv)=>{setLevel(lv);setStep(2);setTimeout(()=>jingle(),300);};
  const ok=name.trim()&&age&&parseInt(age)>=10;

  if(step===0)return React.createElement('div',{style:{minHeight:'100vh',background:'#f8fafc',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px 20px',gap:'14px'}},
    React.createElement('div',{style:{fontSize:'52px'}},'👋'),
    React.createElement('h2',{style:{fontSize:'24px',fontWeight:900,color:'#111',margin:0}},'Bienvenue sur TalkReal !'),
    React.createElement('p',{style:{color:'#94a3b8',fontSize:'14px',textAlign:'center',margin:0}},'2 infos et tu rencontres Prof Sam'),
    React.createElement('input',{value:name,onChange:e=>setName(e.target.value),placeholder:'Ton prenom...',autoFocus:true,style:{width:'100%',maxWidth:'300px',padding:'14px 18px',fontSize:'17px',fontWeight:700,borderRadius:'14px',border:'2px solid #e2e8f0',outline:'none',textAlign:'center',color:'#111'}}),
    React.createElement('input',{type:'number',value:age,onChange:e=>setAge(e.target.value),placeholder:'Ton age...',min:'10',max:'99',style:{width:'150px',padding:'14px 18px',fontSize:'17px',fontWeight:700,borderRadius:'14px',border:'2px solid #e2e8f0',outline:'none',textAlign:'center',color:'#111'}}),
    React.createElement('button',{onClick:()=>setStep(1),disabled:!ok,style:{background:ok?'linear-gradient(135deg,#ef4444,#ec4899)':'#e2e8f0',color:ok?'#fff':'#94a3b8',border:'none',borderRadius:'14px',padding:'15px 32px',fontSize:'16px',fontWeight:800,cursor:ok?'pointer':'not-allowed',width:'100%',maxWidth:'300px'}},'Continuer →')
  );

  if(step===1)return React.createElement('div',{style:{minHeight:'100vh',background:'#f8fafc',display:'flex',flexDirection:'column',padding:'40px 20px'}},
    React.createElement('div',{style:{textAlign:'center',marginBottom:'24px'}},
      React.createElement('div',{style:{fontSize:'28px',fontWeight:900,color:'#111'}},'Hey '+name+' !'),
      React.createElement('div',{style:{color:'#94a3b8',fontSize:'14px',marginTop:'6px'}},"Ton niveau d'anglais actuel ?"),
      React.createElement('div',{style:{color:'#cbd5e1',fontSize:'12px',marginTop:'2px'}},'Sam adapte tout pour toi')
    ),
    React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:'10px'}},
      LEVELS.map(lv=>React.createElement('button',{key:lv.id,onClick:()=>pick(lv),style:{background:'#fff',border:'2px solid #e2e8f0',borderRadius:'18px',padding:'15px 16px',display:'flex',alignItems:'center',gap:'12px',cursor:'pointer',textAlign:'left',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}},
        React.createElement('div',{style:{width:'48px',height:'48px',borderRadius:'13px',background:lv.color+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',flexShrink:0}},lv.emoji),
        React.createElement('div',{style:{flex:1}},
          React.createElement('div',{style:{fontWeight:800,fontSize:'14px',color:'#111'}},lv.label),
          React.createElement('div',{style:{color:'#94a3b8',fontSize:'11px',marginTop:'1px'}},lv.desc)
        ),
        React.createElement('div',{style:{color:'#e2e8f0',fontSize:'16px'}},'→')
      ))
    )
  );

  return React.createElement('div',{style:{minHeight:'100vh',background:'linear-gradient(135deg,#080810,#0f172a)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px 20px',gap:'18px',textAlign:'center'}},
    React.createElement('div',{style:{fontSize:'76px',lineHeight:1}},'🎙️'),
    React.createElement('div',{style:{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'22px',padding:'22px 26px',maxWidth:'310px'}},
      React.createElement('div',{style:{color:'#ef4444',fontSize:'11px',fontWeight:700,letterSpacing:'2px',marginBottom:'8px'}},'PROF SAM'),
      React.createElement('div',{style:{color:'#fff',fontSize:'14px',lineHeight:1.7,fontStyle:'italic'}},'"Hey '+name+"! I'm Sam — your personal American English coach. I'm gonna teach you to speak like a real American. Ready? Let's GO!"
      )
    ),
    React.createElement('div',{style:{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'16px',padding:'14px 20px',maxWidth:'280px',width:'100%'}},
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:'6px'}},
        React.createElement('span',{style:{color:'#475569',fontSize:'12px'}},'Niveau'),
        React.createElement('span',{style:{color:level?level.color:'#fff',fontSize:'12px',fontWeight:700}},level?level.emoji+' '+level.label:'')
      ),
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between'}},
        React.createElement('span',{style:{color:'#475569',fontSize:'12px'}},'Programme'),
        React.createElement('span',{style:{color:'#fff',fontSize:'12px',fontWeight:700}},'20 lecons + badges')
      )
    ),
    React.createElement('button',{onClick:()=>onDone({name,age:parseInt(age),level}),style:{background:'linear-gradient(135deg,#ef4444,#ec4899)',color:'#fff',border:'none',borderRadius:'16px',padding:'17px 42px',fontSize:'17px',fontWeight:900,cursor:'pointer',boxShadow:'0 8px 28px rgba(239,68,68,0.4)'}},"C'est parti avec Sam ! 🚀")
  );
}

function Home({user,done,onSelect}){
  const [tab,setTab]=useState('lessons');
  const xl=getXL(user.xp);
  const nx=getNX(user.xp);
  const pct=nx.min>xl.min?Math.min(100,((user.xp-xl.min)/(nx.min-xl.min))*100):100;
  const earned=getBadges(user,done);
  const themes=[...new Set(LESSONS.map(l=>l.theme))];

  const TabBtn=({id,ico,label})=>React.createElement('button',{onClick:()=>setTab(id),style:{flex:1,padding:'11px 4px',background:'none',border:'none',borderBottom:tab===id?'3px solid #ef4444':'3px solid transparent',cursor:'pointer',fontSize:'10px',fontWeight:tab===id?800:600,color:tab===id?'#ef4444':'#94a3b8',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',minWidth:'60px'}},
    React.createElement('span',{style:{fontSize:'15px'}},ico),label
  );

  return React.createElement('div',{style:{display:'flex',flexDirection:'column',height:'100vh',background:'#f8fafc'}},
    React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',padding:'22px 18px 14px',flexShrink:0}},
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}},
        React.createElement('div',null,
          React.createElement('div',{style:{color:'#475569',fontSize:'12px'}},'Bonjour 👋'),
          React.createElement('div',{style:{color:'#fff',fontSize:'22px',fontWeight:900}},user.name),
          React.createElement('div',{style:{display:'flex',gap:'5px',marginTop:'4px'}},
            React.createElement('span',{style:{background:user.level.color+'22',color:user.level.color,borderRadius:'7px',padding:'2px 9px',fontSize:'10px',fontWeight:700}},user.level.emoji+' '+user.level.label),
            React.createElement('span',{style:{background:'rgba(255,255,255,0.06)',color:'#64748b',borderRadius:'7px',padding:'2px 9px',fontSize:'10px',fontWeight:600}},earned.length+' badges')
          )
        ),
        React.createElement('div',{style:{background:'rgba(255,255,255,0.06)',borderRadius:'12px',padding:'8px 12px',textAlign:'center'}},
          React.createElement('div',{style:{fontSize:'18px'}},'🔥'),
          React.createElement('div',{style:{color:'#fff',fontSize:'15px',fontWeight:900}},user.streak),
          React.createElement('div',{style:{color:'#475569',fontSize:'9px'}},'jours')
        )
      ),
      React.createElement('div',{style:{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.15)',borderRadius:'12px',padding:'10px 12px',marginBottom:'13px',display:'flex',gap:'9px',alignItems:'center'}},
        React.createElement('div',{style:{fontSize:'20px',flexShrink:0}},'🎙️'),
        React.createElement('div',null,
          React.createElement('div',{style:{color:'#ef4444',fontSize:'9px',fontWeight:700,marginBottom:'1px'}},'PROF SAM'),
          React.createElement('div',{style:{color:'#64748b',fontSize:'11px',lineHeight:1.4}},
            done.length===0?'Hey '+user.name+'! Ready for lesson 1? Lets GO!':
            done.length<10?'Great progress '+user.name+'! Keep it up!':
            done.length<20?user.name+', you are halfway! Im proud of you!':
            'LEGENDARY '+user.name+'! All 20 lessons completed!'
          )
        )
      ),
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:'4px'}},
        React.createElement('span',{style:{color:'#475569',fontSize:'10px'}},xl.emoji+' '+xl.name),
        React.createElement('span',{style:{color:'#334155',fontSize:'10px'}},user.xp+' XP')
      ),
      React.createElement('div',{style:{height:'5px',background:'rgba(255,255,255,0.06)',borderRadius:'99px'}},
        React.createElement('div',{style:{height:'100%',width:pct+'%',background:'linear-gradient(90deg,'+xl.color+','+nx.color+')',borderRadius:'99px',transition:'width 0.8s ease'}})
      ),
      React.createElement('div',{style:{color:'#334155',fontSize:'10px',marginTop:'3px',textAlign:'right'}},
        nx.min>xl.min?'→ '+nx.emoji+' '+nx.name+' dans '+(nx.min-user.xp)+' XP':'NIVEAU MAX !'
      )
    ),
    React.createElement('div',{style:{background:'#fff',borderBottom:'1px solid #f1f5f9',padding:'0 12px',flexShrink:0,display:'flex',gap:'0',overflowX:'auto'}},
      React.createElement(TabBtn,{id:'lessons',ico:'📚',label:'Lecons'}),
      React.createElement(TabBtn,{id:'badges',ico:'🏆',label:'Badges'}),
      React.createElement(TabBtn,{id:'rank',ico:'👑',label:'Classement'}),
      React.createElement(TabBtn,{id:'culture',ico:'🗽',label:'Culture'})
    ),
    React.createElement('div',{style:{flex:1,overflowY:'auto'}},
      tab==='lessons'&&React.createElement('div',{style:{padding:'14px'}},
        React.createElement('div',{style:{background:'#fff',borderRadius:'16px',padding:'12px 16px',marginBottom:'14px',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}},
          React.createElement('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:'6px'}},
            React.createElement('span',{style:{fontWeight:800,fontSize:'13px',color:'#111'}},'Ta progression'),
            React.createElement('span',{style:{fontWeight:700,fontSize:'12px',color:'#ef4444'}},done.length+'/20')
          ),
          React.createElement('div',{style:{height:'7px',background:'#f1f5f9',borderRadius:'99px',overflow:'hidden'}},
            React.createElement('div',{style:{height:'100%',width:(done.length/20*100)+'%',background:'linear-gradient(90deg,#ef4444,#ec4899)',borderRadius:'99px',transition:'width 0.6s'}})
          )
        ),
        themes.map(theme=>{
          const tl=LESSONS.filter(l=>l.theme===theme);
          const fl=tl[0];
          return React.createElement('div',{key:theme,style:{marginBottom:'18px'}},
            React.createElement('div',{style:{display:'flex',alignItems:'center',gap:'7px',marginBottom:'8px'}},
              React.createElement('div',{style:{width:'26px',height:'26px',borderRadius:'7px',background:fl.color+'15',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px'}},fl.emoji),
              React.createElement('span',{style:{fontWeight:800,fontSize:'13px',color:'#111'}},theme),
              React.createElement('span',{style:{fontSize:'10px',color:'#cbd5e1',marginLeft:'auto'}},tl.filter(l=>done.includes(l.id)).length+'/'+tl.length)
            ),
            React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:'7px'}},
              tl.map((lesson,i)=>{
                const isDone=done.includes(lesson.id);
                const prev=lesson.id===1||done.includes(lesson.id-1);
                const locked=!prev&&!isDone;
                return React.createElement('button',{key:lesson.id,onClick:()=>!locked&&onSelect(lesson),style:{background:locked?'#f8fafc':'#fff',border:isDone?'2px solid '+lesson.color:'2px solid #e2e8f0',borderRadius:'16px',padding:'12px 14px',display:'flex',alignItems:'center',gap:'10px',cursor:locked?'not-allowed':'pointer',opacity:locked?0.45:1,textAlign:'left',boxShadow:isDone?'0 3px 12px '+lesson.color+'18':'0 2px 5px rgba(0,0,0,0.04)',transition:'all 0.2s'}},
                  React.createElement('div',{style:{width:'44px',height:'44px',borderRadius:'12px',background:locked?'#f1f5f9':lesson.color+'15',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',flexShrink:0,position:'relative'}},
                    lesson.emoji,
                    isDone&&React.createElement('div',{style:{position:'absolute',bottom:'-3px',right:'-3px',background:lesson.color,borderRadius:'50%',width:'15px',height:'15px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'8px',color:'#fff'}},'✓')
                  ),
                  React.createElement('div',{style:{flex:1}},
                    React.createElement('div',{style:{fontWeight:800,fontSize:'13px',color:'#111'}},(locked?'🔒 ':lesson.id+'. ')+lesson.title),
                    React.createElement('div',{style:{display:'flex',gap:'6px',marginTop:'3px'}},
                      React.createElement('span',{style:{background:lesson.color+'15',color:lesson.color,fontSize:'9px',fontWeight:700,borderRadius:'5px',padding:'1px 6px'}},'+'+lesson.xp+' XP'),
                      React.createElement('span',{style:{color:'#cbd5e1',fontSize:'9px'}},'5 phrases · 5 exercices')
                    )
                  ),
                  !locked&&React.createElement('div',{style:{color:lesson.color,fontSize:'12px'}},'→')
                );
              })
            )
          );
        }),
        React.createElement('div',{style:{height:'20px'}})
      ),
      tab==='badges'&&React.createElement('div',{style:{padding:'14px'}},
        React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'14px',padding:'12px 14px',marginBottom:'14px',display:'flex',gap:'9px'}},
          React.createElement('div',{style:{fontSize:'22px'}},'🎙️'),
          React.createElement('div',null,
            React.createElement('div',{style:{color:'#ef4444',fontSize:'9px',fontWeight:700,marginBottom:'1px'}},'PROF SAM'),
            React.createElement('div',{style:{color:'#64748b',fontSize:'11px'}},earned.length+' badges gagnes sur '+BADGES.length+'. '+user.name+', you are doing amazing!')
          )
        ),
        React.createElement('div',{style:{fontWeight:800,fontSize:'15px',color:'#111',marginBottom:'10px'}},'Tes Badges 🏆'),
        React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'9px'}},
          BADGES.map(badge=>{
            const e=earned.includes(badge.id);
            return React.createElement('div',{key:badge.id,style:{background:e?'#fff':'#f8fafc',border:e?'2px solid '+badge.color:'2px solid #f1f5f9',borderRadius:'16px',padding:'14px',textAlign:'center',opacity:e?1:0.5,boxShadow:e?'0 4px 12px '+badge.color+'18':'none',transition:'all 0.3s'}},
              React.createElement('div',{style:{fontSize:'28px',marginBottom:'4px',filter:e?'none':'grayscale(1)'}},badge.emoji),
              React.createElement('div',{style:{fontWeight:800,fontSize:'11px',color:e?'#111':'#94a3b8'}},badge.label),
              React.createElement('div',{style:{fontSize:'9px',color:e?badge.color:'#cbd5e1',marginTop:'2px',lineHeight:1.3}},badge.desc),
              e&&React.createElement('div',{style:{marginTop:'4px',fontSize:'9px',background:badge.color+'15',color:badge.color,borderRadius:'5px',padding:'1px 6px',display:'inline-block',fontWeight:700}},'DEBLOQUE !')
            );
          })
        ),
        React.createElement('div',{style:{height:'20px'}})
      ),
      tab==='rank'&&React.createElement('div',{style:{padding:'14px'}},
        React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'14px',padding:'12px 14px',marginBottom:'14px',display:'flex',gap:'9px'}},
          React.createElement('div',{style:{fontSize:'22px'}},'🎙️'),
          React.createElement('div',null,
            React.createElement('div',{style:{color:'#ef4444',fontSize:'9px',fontWeight:700,marginBottom:'1px'}},'PROF SAM'),
            React.createElement('div',{style:{color:'#64748b',fontSize:'11px'}},'Competition is healthy! Push yourself to the top, '+user.name+'!')
          )
        ),
        React.createElement('div',{style:{fontWeight:800,fontSize:'15px',color:'#111',marginBottom:'10px'}},'Classement Beta 👑'),
        React.createElement('div',{style:{background:'linear-gradient(135deg,#ef444415,#ec489910)',border:'2px solid #ef4444',borderRadius:'16px',padding:'12px 14px',marginBottom:'10px',display:'flex',alignItems:'center',gap:'10px'}},
          React.createElement('div',{style:{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#ef4444,#ec4899)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:'12px',flexShrink:0}},'★'),
          React.createElement('div',{style:{flex:1}},
            React.createElement('div',{style:{fontWeight:800,fontSize:'13px',color:'#111'}},user.name+' — Toi'),
            React.createElement('div',{style:{fontSize:'11px',color:'#ef4444',fontWeight:600}},user.xp+' XP · '+done.length+' lecons')
          ),
          React.createElement('div',{style:{fontWeight:900,fontSize:'16px',color:'#ef4444'}},'#'+(Math.max(1,FRIENDS.filter(f=>f.xp>user.xp).length+1)))
        ),
        FRIENDS.sort((a,b)=>b.xp-a.xp).map((f,i)=>
          React.createElement('div',{key:f.name,style:{background:'#fff',border:'2px solid #f1f5f9',borderRadius:'14px',padding:'11px 14px',marginBottom:'7px',display:'flex',alignItems:'center',gap:'10px',boxShadow:'0 2px 5px rgba(0,0,0,0.04)'}},
            React.createElement('div',{style:{width:'28px',textAlign:'center',fontSize:'16px',flexShrink:0}},i===0?'🥇':i===1?'🥈':i===2?'🥉':(i+1)+''),
            React.createElement('div',{style:{width:'32px',height:'32px',borderRadius:'50%',background:'#f1f5f9',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:800,color:'#64748b',flexShrink:0}},f.name[0]),
            React.createElement('div',{style:{flex:1}},
              React.createElement('div',{style:{fontWeight:800,fontSize:'12px',color:'#111'}},f.name),
              React.createElement('div',{style:{fontSize:'10px',color:'#94a3b8'}},f.xp+' XP · 🔥 '+f.streak+'j')
            )
          )
        ),
        React.createElement('div',{style:{height:'20px'}})
      ),
      tab==='culture'&&React.createElement('div',{style:{padding:'14px'}},
        React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'14px',padding:'12px 14px',marginBottom:'14px',display:'flex',gap:'9px'}},
          React.createElement('div',{style:{fontSize:'22px'}},'🎙️'),
          React.createElement('div',null,
            React.createElement('div',{style:{color:'#ef4444',fontSize:'9px',fontWeight:700,marginBottom:'1px'}},'PROF SAM'),
            React.createElement('div',{style:{color:'#64748b',fontSize:'11px'}},'To speak American, you need to know American culture. Here are the essentials!')
          )
        ),
        React.createElement('div',{style:{fontWeight:800,fontSize:'15px',color:'#111',marginBottom:'10px'}},'Culture Americaine 🗽'),
        React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:'10px'}},
          CULTURE.map((c,i)=>React.createElement('div',{key:i,style:{background:'#fff',border:'2px solid #f1f5f9',borderRadius:'18px',padding:'16px',boxShadow:'0 2px 7px rgba(0,0,0,0.04)'}},
            React.createElement('div',{style:{display:'flex',alignItems:'center',gap:'9px',marginBottom:'8px'}},
              React.createElement('div',{style:{fontSize:'28px'}},c.emoji),
              React.createElement('div',{style:{fontWeight:800,fontSize:'14px',color:'#111'}},c.title)
            ),
            React.createElement('div',{style:{fontSize:'12px',color:'#64748b',lineHeight:1.6}},c.text)
          ))
        ),
        React.createElement('div',{style:{height:'20px'}})
      )
    )
  );
}

function LMenu({lesson,user,onMode,onBack}){
  const [played,setPlayed]=useState(false);
  return React.createElement('div',{style:{padding:'22px 14px',background:'#f8fafc',minHeight:'100vh'}},
    React.createElement(BackBtn,{onClick:onBack}),
    React.createElement('div',{style:{textAlign:'center',margin:'16px 0 20px'}},
      React.createElement('div',{style:{width:'70px',height:'70px',borderRadius:'20px',background:lesson.color+'15',fontSize:'32px',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 10px'}},lesson.emoji),
      React.createElement('div',{style:{fontSize:'10px',color:'#94a3b8',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'3px'}},lesson.theme),
      React.createElement('h2',{style:{margin:0,fontSize:'20px',fontWeight:900}},'Lecon '+lesson.id+' — '+lesson.title),
      React.createElement('div',{style:{display:'inline-block',marginTop:'5px',background:lesson.color+'15',color:lesson.color,borderRadius:'7px',padding:'2px 11px',fontSize:'11px',fontWeight:700}},'+'+lesson.xp+' XP')
    ),
    React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'18px',padding:'16px',marginBottom:'16px'}},
      React.createElement('div',{style:{display:'flex',gap:'11px',alignItems:'flex-start'}},
        React.createElement('div',{style:{fontSize:'28px',flexShrink:0}},'🎙️'),
        React.createElement('div',{style:{flex:1}},
          React.createElement('div',{style:{color:'#ef4444',fontSize:'10px',fontWeight:700,letterSpacing:'1px',marginBottom:'5px'}},'PROF SAM'),
          React.createElement('div',{style:{color:'#94a3b8',fontSize:'12px',lineHeight:1.6,fontStyle:'italic'}},'"'+lesson.sam+'"'),
          React.createElement('button',{onClick:()=>{setPlayed(true);speak(lesson.sam,0.88);},style:{marginTop:'9px',background:played?'rgba(239,68,68,0.15)':'rgba(239,68,68,0.1)',color:'#ef4444',border:'1px solid rgba(239,68,68,0.25)',borderRadius:'9px',padding:'6px 12px',fontSize:'11px',fontWeight:700,cursor:'pointer'}},played?'🔊 Reecouter Sam':'🔊 Ecouter Sam')
        )
      )
    ),
    React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:'9px'}},
      [{key:'learn',emoji:'🎭',label:'Apprendre avec Sam',desc:'Decouvre les phrases avec contexte americain',hot:false},
       {key:'mirror',emoji:'🎙️',label:'Repete apres Sam',desc:'Tu parles, Sam corrige ton accent',hot:true},
       {key:'exos',emoji:'✏️',label:'Exercices',desc:'3 types: remplir, traduire, choix multiple',hot:true},
       {key:'quiz',emoji:'🎯',label:'Quiz — Gagne tes XP',desc:'Valide la lecon et debloque la suivante',hot:false},
      ].map(m=>React.createElement('button',{key:m.key,onClick:()=>onMode(m.key),style:{background:m.hot?lesson.color+'08':'#fff',border:m.hot?'2px solid '+lesson.color:'2px solid #e2e8f0',borderRadius:'14px',padding:'12px 14px',display:'flex',alignItems:'center',gap:'10px',cursor:'pointer',textAlign:'left',boxShadow:m.hot?'0 4px 12px '+lesson.color+'15':'0 2px 5px rgba(0,0,0,0.04)'}},
        React.createElement('div',{style:{width:'40px',height:'40px',borderRadius:'11px',background:lesson.color+'12',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',flexShrink:0}},m.emoji),
        React.createElement('div',null,
          React.createElement('div',{style:{fontWeight:800,fontSize:'13px',color:'#111'}},m.label),
          React.createElement('div',{style:{color:'#94a3b8',fontSize:'10px',marginTop:'1px'}},m.desc)
        ),
        React.createElement('div',{style:{marginLeft:'auto',color:'#e2e8f0'}},'→')
      ))
    )
  );
}

function Learn({lesson,user,onBack}){
  const [wi,setWi]=useState(0);
  const [rev,setRev]=useState(false);
  const [spk,setSpk]=useState(false);
  const w=lesson.words[wi];
  useEffect(()=>setRev(false),[wi]);
  const listenSam=()=>{
    setSpk(true);let c=0;
    const nx=()=>{c++;speak(w.en,user.level.speed,()=>{if(c<user.level.reps)setTimeout(nx,500);else setSpk(false);});};
    nx();
  };
  return React.createElement('div',{style:{padding:'22px 14px',background:'#f8fafc',minHeight:'100vh'}},
    React.createElement(BackBtn,{onClick:onBack}),
    React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'13px',padding:'11px 13px',margin:'12px 0',display:'flex',gap:'9px',alignItems:'center'}},
      React.createElement('div',{style:{fontSize:'20px'}},'🎙️'),
      React.createElement('div',{style:{color:'#64748b',fontSize:'11px'}},
        React.createElement('span',{style:{color:'#ef4444',fontWeight:700}},'Sam : '),
        React.createElement('span',{style:{fontStyle:'italic'}},'Phrase '+(wi+1)+'/'+lesson.words.length+'. Listen and repeat!')
      )
    ),
    React.createElement('div',{style:{fontSize:'11px',color:'#94a3b8',textAlign:'center',marginBottom:'9px'}},'Phrase '+(wi+1)+' / '+lesson.words.length),
    React.createElement('div',{style:{background:'#fff',borderRadius:'18px',padding:'20px',border:'2px solid #f1f5f9',marginBottom:'12px',boxShadow:'0 4px 14px rgba(0,0,0,0.05)'}},
      React.createElement('div',{style:{fontSize:'10px',color:'#cbd5e1',marginBottom:'3px',fontWeight:700,letterSpacing:'1px'}},'FRANCAIS'),
      React.createElement('div',{style:{fontSize:'20px',fontWeight:900,color:'#111',marginBottom:'14px'}},w.fr),
      !rev?React.createElement('button',{onClick:()=>setRev(true),style:{width:'100%',background:'#f8fafc',border:'none',borderRadius:'11px',padding:'13px',fontSize:'13px',color:'#94a3b8',cursor:'pointer',fontWeight:700}},'Voir la traduction de Sam →'):
      React.createElement('div',null,
        React.createElement('div',{style:{fontSize:'10px',color:'#cbd5e1',marginBottom:'3px',fontWeight:700,letterSpacing:'1px'}},'SAM DIT...'),
        React.createElement('div',{style:{fontSize:'22px',fontWeight:900,color:'#111',marginBottom:'3px'}},w.en),
        React.createElement('div',{style:{fontSize:'14px',color:lesson.color,marginBottom:'9px',fontStyle:'italic'}},'['+w.ph+']'),
        React.createElement('div',{style:{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'9px',padding:'9px 11px',marginBottom:'11px'}},
          React.createElement('div',{style:{fontSize:'9px',color:'#92400e',fontWeight:700,marginBottom:'2px',letterSpacing:'1px'}},'SAM EXPLIQUE'),
          React.createElement('div',{style:{fontSize:'11px',color:'#78350f',lineHeight:1.5}},w.tip)
        ),
        React.createElement('button',{onClick:listenSam,style:{width:'100%',background:spk?lesson.color:'#111',color:'#fff',border:'none',borderRadius:'11px',padding:'12px',fontSize:'13px',fontWeight:800,cursor:'pointer',transition:'background 0.2s'}},
          spk?'🔊 Sam parle...':'🔊 Ecouter Sam x'+user.level.reps
        )
      )
    ),
    React.createElement('div',{style:{display:'flex',gap:'9px'}},
      React.createElement('button',{onClick:()=>wi>0&&setWi(wi-1),disabled:wi===0,style:{...BB,opacity:wi===0?0.3:1}},'← Prec'),
      React.createElement('button',{onClick:()=>wi<lesson.words.length-1&&setWi(wi+1),disabled:wi===lesson.words.length-1,style:{...BB,flex:2,background:lesson.color,color:'#fff',opacity:wi===lesson.words.length-1?0.3:1}},'Suivant →')
    )
  );
}

function Mirror({lesson,user,onBack}){
  const [wi,setWi]=useState(0);
  const [phase,setPhase]=useState('ready');
  const [res,setRes]=useState(null);
  const [att,setAtt]=useState(0);
  const [passed,setPassed]=useState([]);
  const [tx,setTx]=useState('');
  const recRef=useRef(null);
  const w=lesson.words[wi];
  useEffect(()=>{setPhase('ready');setRes(null);setTx('');},[wi]);
  const listenSam=()=>{
    setPhase('speaking');let c=0;
    const nx=()=>{c++;speak(w.en,user.level.speed,()=>{if(c<user.level.reps)setTimeout(nx,500);else setPhase('ready');});};
    nx();
  };
  const startRec=()=>{
    if(phase==='speaking'||phase==='listening')return;
    setPhase('listening');setTx('');
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setPhase('manual');return;}
    let got=false;
    try{
      const r=new SR();
      r.lang='en-US';r.continuous=false;r.interimResults=false;
      recRef.current=r;
      r.onresult=(e)=>{
        got=true;
        const said=e.results[0][0].transcript.toLowerCase().trim();
        const tw=w.en.toLowerCase().replace(/[^a-z\s]/g,'').split(' ').filter(Boolean);
        const sw=said.replace(/[^a-z\s]/g,'').split(' ').filter(Boolean);
        const m=tw.filter(t=>sw.some(s=>s.includes(t.slice(0,3))||t.includes(s.slice(0,3))));
        doRes(said,m.length/Math.max(tw.length,1)>=0.45);
      };
      r.onerror=(e)=>{got=true;setPhase(e.error==='not-allowed'?'manual':'ready');};
      r.onend=()=>{if(!got)setPhase(p=>p==='listening'?'manual':p);};
      r.start();
    }catch(e){setPhase('manual');}
  };
  const doRes=(said,ok)=>{
    if(recRef.current){try{recRef.current.stop();}catch(_){}}
    setTx(said);setRes(ok?'ok':'fail');setPhase('result');tone(ok);
  };
  const next=()=>{
    if(res==='ok'){
      setPassed(p=>[...p,wi]);
      if(wi+1>=lesson.words.length)setPhase('done');
      else{setWi(wi+1);setAtt(0);}
    }else{setAtt(a=>a+1);setRes(null);setTx('');setPhase('ready');}
  };
  if(phase==='done')return React.createElement('div',{style:{padding:'38px 18px',display:'flex',flexDirection:'column',alignItems:'center',gap:'14px',textAlign:'center',background:'#f8fafc',minHeight:'100vh'}},
    React.createElement('div',{style:{fontSize:'66px'}},'🎙️'),
    React.createElement('div',{style:{fontSize:'22px',fontWeight:900}},'Sam est fier de toi !'),
    React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'16px',padding:'14px 18px',maxWidth:'290px',width:'100%'}},
      React.createElement('div',{style:{color:'#ef4444',fontSize:'10px',fontWeight:700,marginBottom:'4px'}},'PROF SAM'),
      React.createElement('div',{style:{color:'#94a3b8',fontSize:'12px',fontStyle:'italic'}},'"'+passed.length+'/'+lesson.words.length+' phrases reussies. '+user.name+', you are becoming a real American speaker!"')
    ),
    React.createElement('button',{onClick:onBack,style:{background:lesson.color,color:'#fff',border:'none',borderRadius:'13px',padding:'14px 30px',fontSize:'14px',fontWeight:800,cursor:'pointer'}},'Retour 🏠')
  );
  return React.createElement('div',{style:{padding:'22px 14px',background:'#f8fafc',minHeight:'100vh'}},
    React.createElement(BackBtn,{onClick:onBack}),
    React.createElement('div',{style:{textAlign:'center',margin:'9px 0 11px'}},
      React.createElement('div',{style:{fontSize:'10px',color:'#94a3b8',marginBottom:'4px'}},'Phrase '+(wi+1)+' / '+lesson.words.length),
      React.createElement('div',{style:{height:'4px',background:'#e2e8f0',borderRadius:'99px'}},
        React.createElement('div',{style:{height:'100%',width:(wi/lesson.words.length*100)+'%',background:lesson.color,borderRadius:'99px',transition:'width 0.4s'}})
      )
    ),
    React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'18px',padding:'18px',textAlign:'center',marginBottom:'12px'}},
      React.createElement('div',{style:{fontSize:'10px',color:'#475569',marginBottom:'5px',letterSpacing:'1px'}},'DIS EN AMERICAIN'),
      React.createElement('div',{style:{fontSize:'18px',fontWeight:900,color:'#fff',marginBottom:'7px'}},w.fr),
      React.createElement('div',{style:{fontSize:'15px',color:lesson.color,fontWeight:700,marginBottom:'1px'}},w.en),
      React.createElement('div',{style:{fontSize:'11px',color:'#475569',fontStyle:'italic'}},'['+w.ph+']')
    ),
    phase==='result'&&React.createElement('div',{style:{marginBottom:'11px'}},
      React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'12px',padding:'11px 14px',marginBottom:'9px',display:'flex',gap:'9px'}},
        React.createElement('div',{style:{fontSize:'20px'}},'🎙️'),
        React.createElement('div',null,
          React.createElement('div',{style:{color:'#ef4444',fontSize:'9px',fontWeight:700,marginBottom:'1px'}},'SAM DIT :'),
          React.createElement('div',{style:{color:res==='ok'?'#10b981':'#f59e0b',fontSize:'12px',fontWeight:700}},res==='ok'?rnd(WIN):rnd(TRY)),
          tx&&React.createElement('div',{style:{color:'#475569',fontSize:'10px',marginTop:'1px'}},'Tu as dit : "'+tx+'"')
        )
      ),
      React.createElement('div',{style:{background:res==='ok'?'#10b98112':'#f59e0b12',border:'2px solid '+(res==='ok'?'#10b981':'#f59e0b'),borderRadius:'13px',padding:'13px',textAlign:'center',marginBottom:'9px'}},
        React.createElement('div',{style:{fontSize:'34px',marginBottom:'3px'}},res==='ok'?'✅':'🔄'),
        React.createElement('div',{style:{fontWeight:800,fontSize:'15px',color:res==='ok'?'#10b981':'#f59e0b'}},res==='ok'?'Parfait !':'Presque ! Reessaie 💪')
      ),
      React.createElement('button',{onClick:next,style:{width:'100%',background:res==='ok'?'#10b981':lesson.color,color:'#fff',border:'none',borderRadius:'12px',padding:'13px',fontSize:'14px',fontWeight:800,cursor:'pointer'}},
        res==='ok'?(wi+1>=lesson.words.length?'Terminer 🏁':'Suivant →'):'Reessayer 🔄'
      )
    ),
    phase==='listening'&&React.createElement('div',{style:{textAlign:'center',padding:'18px',background:lesson.color+'10',borderRadius:'16px',border:'2px solid '+lesson.color,marginBottom:'11px'}},
      React.createElement('div',{style:{fontSize:'32px',marginBottom:'5px'}},'👂'),
      React.createElement('div',{style:{fontWeight:800,fontSize:'14px',color:'#111',marginBottom:'5px'}},"Sam t'ecoute..."),
      React.createElement('div',{style:{display:'flex',justifyContent:'center',gap:'4px'}},
        [0,1,2,3].map(i=>React.createElement('div',{key:i,style:{width:'4px',height:'20px',background:lesson.color,borderRadius:'99px',animation:'bounce 0.7s '+(i*0.12)+'s infinite alternate'}}))
      )
    ),
    phase==='speaking'&&React.createElement('div',{style:{textAlign:'center',padding:'14px',background:'#f1f5f9',borderRadius:'14px',marginBottom:'11px'}},
      React.createElement('div',{style:{fontSize:'26px'}},'🔊'),
      React.createElement('div',{style:{fontWeight:700,fontSize:'12px',color:'#111',marginTop:'3px'}},'Sam parle ('+user.level.reps+'x)...')
    ),
    phase==='ready'&&res===null&&React.createElement('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:'11px'}},
      att>0&&React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'11px',padding:'9px 13px',textAlign:'center',width:'100%'}},
        React.createElement('div',{style:{color:'#ef4444',fontSize:'9px',fontWeight:700,marginBottom:'1px'}},'SAM :'),
        React.createElement('div',{style:{color:'#94a3b8',fontSize:'11px',fontStyle:'italic'}},"Don't give up! Try: "+w.en)
      ),
      React.createElement('button',{onClick:startRec,style:{width:'86px',height:'86px',borderRadius:'50%',background:'linear-gradient(135deg,'+lesson.color+',#ec4899)',border:'none',cursor:'pointer',fontSize:'32px',boxShadow:'0 9px 26px '+lesson.color+'45',display:'flex',alignItems:'center',justifyContent:'center'}},'🎙️'),
      React.createElement('div',{style:{fontWeight:800,fontSize:'14px',color:'#111'}},'Appuie et parle !'),
      React.createElement('div',{style:{fontSize:'11px',color:'#94a3b8'}},'Dis : "'+w.en+'"'),
      React.createElement('button',{onClick:listenSam,style:{background:'none',border:'1.5px solid '+lesson.color,borderRadius:'10px',padding:'6px 16px',fontSize:'11px',color:lesson.color,cursor:'pointer',fontWeight:700}},'🔊 Ecouter x'+user.level.reps)
    ),
    phase==='manual'&&React.createElement('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:'9px'}},
      React.createElement('div',{style:{background:'#fffbeb',border:'2px solid #fde68a',borderRadius:'13px',padding:'13px',width:'100%',textAlign:'center'}},
        React.createElement('div',{style:{fontWeight:800,fontSize:'11px',color:'#92400e'}},'Micro non disponible'),
        React.createElement('div',{style:{fontSize:'10px',color:'#78350f',marginTop:'1px',lineHeight:1.4}},'Ouvre dans Safari sur iPhone. Pratique a voix haute !')
      ),
      React.createElement('div',{style:{fontWeight:700,fontSize:'14px',textAlign:'center'}},'Prononce : ',React.createElement('span',{style:{color:lesson.color}},'"'+w.en+'"')),
      React.createElement('button',{onClick:listenSam,style:{background:'none',border:'1.5px solid '+lesson.color,borderRadius:'10px',padding:'6px 16px',fontSize:'11px',color:lesson.color,cursor:'pointer',fontWeight:700}},'🔊 Ecouter Sam'),
      React.createElement('div',{style:{display:'flex',gap:'9px',width:'100%'}},
        React.createElement('button',{onClick:()=>doRes('',false),style:{flex:1,background:'#f1f5f9',border:'none',borderRadius:'11px',padding:'11px',fontSize:'12px',fontWeight:700,cursor:'pointer',color:'#64748b'}},'😅 Pas encore'),
        React.createElement('button',{onClick:()=>doRes(w.en,true),style:{flex:1,background:lesson.color,border:'none',borderRadius:'11px',padding:'11px',fontSize:'12px',fontWeight:800,cursor:'pointer',color:'#fff'}},'✅ Reussi !')
      )
    ),
    React.createElement('style',null,'@keyframes bounce{from{transform:scaleY(0.4)}to{transform:scaleY(1.7)}}')
  );
}

function Exos({lesson,user,onBack}){
  const [ei,setEi]=useState(0);
  const [inp,setInp]=useState('');
  const [cho,setCho]=useState(null);
  const [chk,setChk]=useState(false);
  const [cor,setCor]=useState(false);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const ex=lesson.ex[ei];
  const reset=()=>{setInp('');setCho(null);setChk(false);setCor(false);};
  const check=()=>{
    const ans=ex.t==='pick'?cho:inp.trim().toLowerCase();
    const ok=ans===ex.a.toLowerCase()||ans?.replace(/[!?,.']/g,'')===ex.a.toLowerCase().replace(/[!?,.']/g,'');
    setCor(ok);setChk(true);tone(ok);if(ok)setScore(s=>s+1);
  };
  const next=()=>{if(ei+1>=lesson.ex.length)setDone(true);else{setEi(ei+1);reset();}};
  if(done){
    const pct=Math.round(score/lesson.ex.length*100);
    return React.createElement('div',{style:{padding:'30px 18px',display:'flex',flexDirection:'column',alignItems:'center',gap:'13px',textAlign:'center',background:'#f8fafc',minHeight:'100vh'}},
      React.createElement('div',{style:{fontSize:'58px'}},pct===100?'🏆':pct>=80?'🌟':pct>=60?'👍':'💪'),
      React.createElement('div',{style:{fontSize:'24px',fontWeight:900}},score+'/'+lesson.ex.length),
      React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'16px',padding:'14px 18px',maxWidth:'290px',width:'100%'}},
        React.createElement('div',{style:{color:'#ef4444',fontSize:'10px',fontWeight:700,marginBottom:'4px'}},'PROF SAM'),
        React.createElement('div',{style:{color:'#94a3b8',fontSize:'12px',fontStyle:'italic'}},
          pct===100?'"PERFECT '+user.name+'! 100 percent! You are on fire!"':
          pct>=60?'"Well done '+user.name+'! Do the quiz to unlock the next lesson!"':
          '"Keep going '+user.name+'! Practice makes perfect!"'
        )
      ),
      React.createElement('button',{onClick:onBack,style:{background:lesson.color,color:'#fff',border:'none',borderRadius:'13px',padding:'14px 30px',fontSize:'14px',fontWeight:800,cursor:'pointer'}},'Retour 🏠')
    );
  }
  return React.createElement('div',{style:{padding:'22px 14px',background:'#f8fafc',minHeight:'100vh'}},
    React.createElement(BackBtn,{onClick:onBack}),
    React.createElement('div',{style:{margin:'12px 0 14px'}},
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:'4px'}},
        React.createElement('span',{style:{fontSize:'11px',color:'#94a3b8'}},'Exercice '+(ei+1)+'/'+lesson.ex.length),
        React.createElement('span',{style:{fontSize:'11px',color:'#94a3b8'}},'✅ '+score+' bons')
      ),
      React.createElement('div',{style:{height:'4px',background:'#e2e8f0',borderRadius:'99px'}},
        React.createElement('div',{style:{height:'100%',width:(ei/lesson.ex.length*100)+'%',background:lesson.color,borderRadius:'99px',transition:'width 0.3s'}})
      )
    ),
    React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'14px',padding:'12px 14px',marginBottom:'14px',display:'flex',gap:'9px'}},
      React.createElement('div',{style:{fontSize:'22px'}},'🎙️'),
      React.createElement('div',null,
        React.createElement('div',{style:{color:'#ef4444',fontSize:'9px',fontWeight:700,marginBottom:'1px'}},'SAM :'),
        React.createElement('div',{style:{color:'#94a3b8',fontSize:'12px',fontStyle:'italic'}},'"'+ex.q+'"')
      )
    ),
    ex.t==='fill'&&React.createElement('div',{style:{marginBottom:'13px'}},
      React.createElement('div',{style:{background:'#f1f5f9',borderRadius:'13px',padding:'16px',textAlign:'center',marginBottom:'9px'}},
        React.createElement('div',{style:{fontSize:'17px',fontWeight:800,color:'#111',lineHeight:1.6}},
          ex.q.split('___').map((part,i,arr)=>React.createElement('span',{key:i},
            part,
            i<arr.length-1&&React.createElement('span',{style:{borderBottom:'3px solid '+lesson.color,padding:'1px 7px',color:chk?(cor?'#10b981':'#ef4444'):'#111',fontStyle:chk?'normal':'italic'}},
              chk?(cor?inp||ex.a:inp||'___'):(inp||'___')
            )
          ))
        ),
        React.createElement('div',{style:{fontSize:'10px',color:'#cbd5e1',marginTop:'5px'}},'Phonetique : ['+ex.h+']')
      ),
      React.createElement('input',{value:inp,onChange:e=>setInp(e.target.value),onKeyDown:e=>e.key==='Enter'&&!chk&&check(),placeholder:'Tape ta reponse... ['+ex.h+']',disabled:chk,style:{width:'100%',padding:'12px 14px',fontSize:'15px',fontWeight:700,borderRadius:'12px',border:'2px solid '+(chk?(cor?'#10b981':'#ef4444'):'#e2e8f0'),outline:'none',textAlign:'center',color:'#111',boxSizing:'border-box',marginBottom:'9px'}})
    ),
    ex.t==='trans'&&React.createElement('div',{style:{marginBottom:'13px'}},
      React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'13px',padding:'16px',textAlign:'center',marginBottom:'9px'}},
        React.createElement('div',{style:{fontSize:'10px',color:'#475569',marginBottom:'5px',letterSpacing:'1px'}},'TRADUIS EN AMERICAIN'),
        React.createElement('div',{style:{fontSize:'18px',fontWeight:900,color:'#fff'}},ex.q),
        React.createElement('div',{style:{fontSize:'10px',color:'#334155',marginTop:'3px'}},'['+ex.h+']')
      ),
      React.createElement('input',{value:inp,onChange:e=>setInp(e.target.value),onKeyDown:e=>e.key==='Enter'&&!chk&&check(),placeholder:'Ta traduction... ['+ex.h+']',disabled:chk,style:{width:'100%',padding:'12px 14px',fontSize:'14px',fontWeight:700,borderRadius:'12px',border:'2px solid '+(chk?(cor?'#10b981':'#ef4444'):'#e2e8f0'),outline:'none',textAlign:'center',color:'#111',boxSizing:'border-box',marginBottom:'9px'}})
    ),
    ex.t==='pick'&&React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'13px'}},
      ex.o.map(opt=>{
        const isA=opt===ex.a,isCh=opt===cho;
        return React.createElement('button',{key:opt,onClick:()=>!chk&&setCho(opt),style:{background:chk?(isA?'#10b981':isCh?'#ef4444':'#f1f5f9'):(isCh?'#111':'#fff'),color:chk&&(isA||isCh)?'#fff':isCh?'#fff':'#111',border:'2px solid '+(chk?(isA?'#10b981':isCh?'#ef4444':'#e2e8f0'):(isCh?'#111':'#e2e8f0')),borderRadius:'12px',padding:'12px 14px',fontSize:'13px',fontWeight:700,cursor:chk?'default':'pointer',textAlign:'center',transition:'all 0.2s'}},opt);
      })
    ),
    chk&&React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'12px',padding:'11px 13px',marginBottom:'9px',display:'flex',gap:'9px'}},
      React.createElement('div',{style:{fontSize:'18px'}},'🎙️'),
      React.createElement('div',null,
        React.createElement('div',{style:{color:'#ef4444',fontSize:'9px',fontWeight:700,marginBottom:'1px'}},'SAM CORRIGE :'),
        React.createElement('div',{style:{color:cor?'#10b981':'#f59e0b',fontSize:'12px',fontWeight:700}},cor?'Perfect! Exactly right!':'La bonne reponse : "'+ex.a+'"')
      )
    ),
    !chk?React.createElement('button',{onClick:check,disabled:ex.t==='pick'?!cho:!inp.trim(),style:{width:'100%',background:(ex.t==='pick'?cho:inp.trim())?lesson.color:'#e2e8f0',color:(ex.t==='pick'?cho:inp.trim())?'#fff':'#94a3b8',border:'none',borderRadius:'12px',padding:'13px',fontSize:'14px',fontWeight:800,cursor:(ex.t==='pick'?cho:inp.trim())?'pointer':'not-allowed'}},'Valider ✓'):
    React.createElement('button',{onClick:next,style:{width:'100%',background:cor?'#10b981':lesson.color,color:'#fff',border:'none',borderRadius:'12px',padding:'13px',fontSize:'14px',fontWeight:800,cursor:'pointer'}},
      ei+1>=lesson.ex.length?'Voir resultats 🏁':'Exercice suivant →'
    )
  );
}

function Quiz({lesson,user,onComplete,onBack}){
  const [qi,setQi]=useState(0);
  const [sc,setSc]=useState(0);
  const [cho,setCho]=useState(null);
  const [done,setDone]=useState(false);
  const w=lesson.words[qi];
  const opts=shuffle([w.en,...shuffle(lesson.words.filter(x=>x.en!==w.en)).slice(0,3).map(x=>x.en)]).slice(0,4);
  const pick=(c)=>{
    if(cho)return;
    const ok=c===w.en;setCho(c);tone(ok);
    if(ok){setSc(s=>s+1);speak(w.en,user.level.speed);}
    setTimeout(()=>{if(qi+1>=lesson.words.length)setDone(true);else{setQi(i=>i+1);setCho(null);}},1000);
  };
  if(done){
    const pct=Math.round(sc/lesson.words.length*100);
    const ok=pct>=60;
    return React.createElement('div',{style:{padding:'26px',display:'flex',flexDirection:'column',alignItems:'center',gap:'13px',textAlign:'center',background:'#f8fafc',minHeight:'100vh'}},
      React.createElement('div',{style:{fontSize:'60px'}},pct===100?'🏆':pct>=80?'🌟':ok?'👍':'💪'),
      React.createElement('div',{style:{fontSize:'24px',fontWeight:900}},sc+'/'+lesson.words.length),
      React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'16px',padding:'14px 18px',maxWidth:'290px',width:'100%'}},
        React.createElement('div',{style:{color:'#ef4444',fontSize:'10px',fontWeight:700,marginBottom:'4px'}},'PROF SAM'),
        React.createElement('div',{style:{color:'#94a3b8',fontSize:'12px',fontStyle:'italic'}},
          pct===100?'"PERFECT '+user.name+'! LEGENDARY!"':
          ok?'"Well done '+user.name+'! Lesson '+lesson.id+' done! Next one is unlocked!"':
          '"Keep going '+user.name+'! You need 60 percent to pass. I believe in you!"'
        )
      ),
      ok?React.createElement('button',{onClick:()=>onComplete(lesson.xp),style:{background:lesson.color,color:'#fff',border:'none',borderRadius:'13px',padding:'14px 30px',fontSize:'14px',fontWeight:800,cursor:'pointer'}},'+'+lesson.xp+' XP — Suivante 🚀'):
      React.createElement('button',{onClick:()=>{setQi(0);setSc(0);setCho(null);setDone(false);},style:{background:'#111',color:'#fff',border:'none',borderRadius:'13px',padding:'14px 30px',fontSize:'14px',fontWeight:800,cursor:'pointer'}},'Reessayer avec Sam 🔄'),
      React.createElement('button',{onClick:onBack,style:{background:'none',border:'none',color:'#94a3b8',cursor:'pointer',fontSize:'12px'}},'Retour')
    );
  }
  return React.createElement('div',{style:{padding:'22px 14px',background:'#f8fafc',minHeight:'100vh'}},
    React.createElement(BackBtn,{onClick:onBack}),
    React.createElement('div',{style:{margin:'11px 0 13px'}},
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:'4px'}},
        React.createElement('span',{style:{fontSize:'11px',color:'#94a3b8'}},'Quiz final'),
        React.createElement('span',{style:{fontSize:'11px',color:'#94a3b8'}},(qi+1)+'/'+lesson.words.length)
      ),
      React.createElement('div',{style:{height:'4px',background:'#e2e8f0',borderRadius:'99px'}},
        React.createElement('div',{style:{height:'100%',width:(qi/lesson.words.length*100)+'%',background:lesson.color,borderRadius:'99px',transition:'width 0.3s'}})
      )
    ),
    React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'11px',padding:'9px 13px',marginBottom:'13px',display:'flex',gap:'7px',alignItems:'center'}},
      React.createElement('div',{style:{fontSize:'16px'}},'🎙️'),
      React.createElement('div',{style:{color:'#475569',fontSize:'11px',fontStyle:'italic'}},'Sam : "Traduis en americain !"')
    ),
    React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'18px',padding:'20px',textAlign:'center',marginBottom:'16px'}},
      React.createElement('div',{style:{fontSize:'10px',color:'#475569',marginBottom:'5px',letterSpacing:'1px'}},'TRADUIS EN AMERICAIN'),
      React.createElement('div',{style:{fontSize:'20px',fontWeight:900,color:'#fff'}},w.fr)
    ),
    React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'9px'}},
      opts.map(c=>{
        const ok=c===w.en;
        return React.createElement('button',{key:c,onClick:()=>pick(c),style:{background:cho?(ok?'#10b981':c===cho?'#ef4444':'#f1f5f9'):'#fff',color:cho&&(ok||c===cho)?'#fff':'#111',border:'2px solid '+(cho?(ok?'#10b981':c===cho?'#ef4444':'#e2e8f0'):'#e2e8f0'),borderRadius:'13px',padding:'13px 7px',fontSize:'12px',fontWeight:700,cursor:cho?'default':'pointer',transition:'all 0.2s',lineHeight:1.3,textAlign:'center'}},c);
      })
    )
  );
}

function XPPop({xp,onDone}){
  const [show,setShow]=useState(true);
  useEffect(()=>{const t=setTimeout(()=>{setShow(false);setTimeout(onDone,400);},2500);return()=>clearTimeout(t);},[]);
  return React.createElement('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,opacity:show?1:0,transition:'opacity 0.4s'}},
    React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'26px',padding:'40px 48px',textAlign:'center',transform:show?'scale(1)':'scale(0.85)',transition:'transform 0.4s'}},
      React.createElement('div',{style:{fontSize:'52px'}},'⭐'),
      React.createElement('div',{style:{fontSize:'32px',fontWeight:900,color:'#fff',margin:'7px 0 3px'}},'+'+xp+' XP'),
      React.createElement('div',{style:{color:'#ef4444',fontSize:'13px',fontWeight:700}},'Lecon validee !'),
      React.createElement('div',{style:{color:'#475569',fontSize:'11px',marginTop:'3px',fontStyle:'italic'}},'Sam est fier de toi 🎙️')
    )
  );
}

function BadgePop({badge,onDone}){
  const [show,setShow]=useState(true);
  useEffect(()=>{const t=setTimeout(()=>{setShow(false);setTimeout(onDone,400);},3000);return()=>clearTimeout(t);},[]);
  return React.createElement('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:10000,opacity:show?1:0,transition:'opacity 0.4s'}},
    React.createElement('div',{style:{background:'linear-gradient(135deg,#080810,#0f172a)',border:'1px solid '+badge.color+'40',borderRadius:'26px',padding:'38px 46px',textAlign:'center',transform:show?'scale(1)':'scale(0.85)',transition:'transform 0.4s',maxWidth:'270px'}},
      React.createElement('div',{style:{fontSize:'12px',color:badge.color,fontWeight:700,letterSpacing:'2px',marginBottom:'9px'}},'NOUVEAU BADGE !'),
      React.createElement('div',{style:{fontSize:'56px',marginBottom:'7px'}},badge.emoji),
      React.createElement('div',{style:{fontSize:'18px',fontWeight:900,color:'#fff',marginBottom:'3px'}},badge.label),
      React.createElement('div',{style:{color:'#64748b',fontSize:'12px'}},badge.desc)
    )
  );
}

export default function App(){
  const [scr,setScr]=useState('access');
  const [user,setUser]=useState({name:'',age:25,level:LEVELS[0],xp:0,streak:1});
  const [done,setDone]=useState([]);
  const [lesson,setLesson]=useState(null);
  const [mode,setMode]=useState(null);
  const [xpPop,setXpPop]=useState(null);
  const [badgePop,setBadgePop]=useState(null);
  const prevB=useRef([]);

  const handleComplete=(xp)=>{
    const nd=done.includes(lesson.id)?done:[...done,lesson.id];
    const nu={...user,xp:user.xp+xp};
    setDone(nd);setUser(nu);setXpPop(xp);setMode(null);
    const nb=getBadges(nu,nd);
    const newOnes=nb.filter(b=>!prevB.current.includes(b));
    if(newOnes.length>0){
      const b=BADGES.find(x=>x.id===newOnes[0]);
      if(b)setTimeout(()=>setBadgePop(b),2700);
    }
    prevB.current=nb;
  };

  return React.createElement('div',{style:{minHeight:'100vh',fontFamily:"-apple-system,'Segoe UI',sans-serif",maxWidth:'480px',margin:'0 auto',position:'relative'}},
    xpPop&&React.createElement(XPPop,{xp:xpPop,onDone:()=>setXpPop(null)}),
    badgePop&&React.createElement(BadgePop,{badge:badgePop,onDone:()=>setBadgePop(null)}),
    scr==='access'&&React.createElement(Access,{onDone:()=>setScr('onboard')}),
    scr==='onboard'&&React.createElement(Onboard,{onDone:u=>{setUser({...u,xp:0,streak:1});setScr('home');}}),
    scr==='home'&&!lesson&&React.createElement(Home,{user,done,onSelect:l=>{setLesson(l);setMode(null);}}),
    lesson&&!mode&&React.createElement(LMenu,{lesson,user,onMode:m=>setMode(m),onBack:()=>setLesson(null)}),
    lesson&&mode==='learn'&&React.createElement(Learn,{lesson,user,onBack:()=>setMode(null)}),
    lesson&&mode==='mirror'&&React.createElement(Mirror,{lesson,user,onBack:()=>setMode(null)}),
    lesson&&mode==='exos'&&React.createElement(Exos,{lesson,user,onBack:()=>setMode(null)}),
    lesson&&mode==='quiz'&&React.createElement(Quiz,{lesson,user,onComplete:handleComplete,onBack:()=>setMode(null)})
  );
}
