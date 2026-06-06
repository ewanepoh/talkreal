import React, { useState, useEffect, useRef } from 'react';

// ACCESS CODES
const CODES = {
  'TALKREAL2024':true,'BETA-VIP':true,'BETA-MARIE':true,'BETA-PAUL':true,
  'BETA-SOFIA':true,'BETA-AHMED':true,'BETA-LUCAS':true,'BETA-SARAH':true,
  'BETA-YANN':true,'BETA-AISHA':true,'BETA-KEVIN':true,'BETA-LINA':true,
};

// LEVELS - 6 levels including Accent Parfait
const LEVELS = [
  {id:'zero',      emoji:'🥚', label:'Niveau Zero',      desc:"Je ne connais aucun mot anglais",                color:'#94a3b8', speed:0.62, reps:4},
  {id:'debutant',  emoji:'🌱', label:'Debutant',          desc:"Je connais quelques mots (hi, yes, no...)",      color:'#10b981', speed:0.72, reps:3},
  {id:'scolaire',  emoji:'📚', label:'Anglais Scolaire',  desc:"Appris a l'ecole mais pas l'accent US",          color:'#3b82f6', speed:0.80, reps:2},
  {id:'inter',     emoji:'🚀', label:'Intermediaire',     desc:"Je comprends mais je bloque a l oral",           color:'#8b5cf6', speed:0.87, reps:2},
  {id:'avance',    emoji:'🎯', label:'Avance',            desc:"Je parle mais je veux sonner vraiment americain", color:'#f59e0b', speed:0.93, reps:1},
  {id:'accent',    emoji:'*', label:'Accent Parfait',    desc:"Je veux etre indiscernable d un natif americain",color:'#ef4444', speed:0.98, reps:1},
];

// BADGES
const ALL_BADGES = [
  {id:'first',    emoji:'🎉', label:'Premiers Pas',    desc:"Terminer ta premiere lecon",           color:'#10b981'},
  {id:'streak3',  emoji:'🔥', label:'En Feu',          desc:"3 jours consecutifs",                  color:'#f97316'},
  {id:'streak7',  emoji:'💎', label:'Semaine Complete', desc:"7 jours consecutifs",                 color:'#6366f1'},
  {id:'xp100',    emoji:'⚡', label:'Energique',       desc:"Atteindre 100 XP",                    color:'#eab308'},
  {id:'xp500',    emoji:'🏆', label:'Champion',        desc:"Atteindre 500 XP",                    color:'#f59e0b'},
  {id:'xp1000',   emoji:'👑', label:'Royaute',         desc:"Atteindre 1000 XP",                   color:'#ec4899'},
  {id:'lesson5',  emoji:'📖', label:'Studieux',        desc:"Completer 5 lecons",                   color:'#3b82f6'},
  {id:'lesson10', emoji:'🎓', label:'Mi-Parcours',     desc:"Completer 10 lecons",                  color:'#8b5cf6'},
  {id:'lesson20', emoji:'🌟', label:'Maitre',          desc:"Completer les 20 lecons",              color:'#ef4444'},
  {id:'perfect',  emoji:'💯', label:'Parfait',         desc:"100% a un quiz",                       color:'#10b981'},
  {id:'mirror10', emoji:'🎙', label:'Orateur',         desc:"10 sessions Mode Miroir",              color:'#14b8a6'},
  {id:'speed',    emoji:'⚡', label:'Rapide',          desc:"Finir un quiz en moins de 30 secondes", color:'#f59e0b'},
];

// LEADERBOARD (mock friends)
const MOCK_FRIENDS = [
  {name:'Kofi',    xp:1250, streak:12, flag:'GH'},
  {name:'Amina',   xp:980,  streak:8,  flag:'SN'},
  {name:'Thomas',  xp:720,  streak:5,  flag:'CI'},
  {name:'Fatou',   xp:540,  streak:3,  flag:'ML'},
  {name:'Ibrahim', xp:380,  streak:6,  flag:'CM'},
  {name:'Chloe',   xp:210,  streak:2,  flag:'FR'},
  {name:'Moussa',  xp:150,  streak:4,  flag:'GN'},
];

// 20 LESSONS
const LESSONS = [
  // THEME 1: SALUTATIONS
  {
    id:1, theme:'Salutations', emoji:'👋', title:'Premier Contact', color:'#ef4444', xp:25,
    samSays:"Hey! Lesson 1 — how real Americans say hello. Forget school English. Listen and repeat!",
    words:[
      {fr:"Hey, quoi de neuf ?",   en:"Hey, what's up?",   ph:"he wots ap",       tip:"Salutation N1 aux USA — oublie Hello !"},
      {fr:"Ca roule !",            en:"It's all good!",    ph:"its ol goud",      tip:"Reponse positive — culture americaine"},
      {fr:"Je m'appelle...",       en:"I'm...",            ph:"aim",              tip:"My name is c'est trop scolaire"},
      {fr:"Enchante",             en:"Nice to meet you",  ph:"nais tou mit you", tip:"Avec un grand sourire — obligatoire !"},
      {fr:"A plus !",              en:"Later!",            ph:"lei-ter",          tip:"Ou See ya! — jamais Goodbye"},
    ],
    exercises:[
      {type:'fill',   q:"Hey, ___ up?",                   a:"what's",           hint:"wots"},
      {type:'fill',   q:"It's all ___!",                  a:"good",             hint:"goud"},
      {type:'choice', q:"Comment dire 'Enchante' ?",       a:"Nice to meet you", opts:["Nice to meet you","Good to see you","Happy meeting","Glad hello"]},
      {type:'trans',  q:"Je m'appelle Marie",              a:"I'm Marie",        hint:"aim Marie"},
      {type:'choice', q:"Comment dire 'A plus' americain ?",a:"Later!",          opts:["Goodbye!","Later!","Farewell!","See you later!"]},
    ],
  },
  {
    id:2, theme:'Salutations', emoji:'🤝', title:'Faire Connaissance', color:'#ef4444', xp:25,
    samSays:"Round 2 on greetings! Now you'll learn how Americans introduce themselves and small talk.",
    words:[
      {fr:"Tu viens d'ou ?",       en:"Where are you from?",    ph:"wer ar you from",     tip:"Question classique entre Americains"},
      {fr:"Je viens de France",    en:"I'm from France",        ph:"aim from Frans",       tip:"Simple, direct et efficace"},
      {fr:"Tu fais quoi dans la vie ?", en:"What do you do?",  ph:"wot dou you dou",     tip:"Pour demander le metier"},
      {fr:"Depuis quand tu es ici ?",   en:"How long have you been here?", ph:"hao long hav you bin hier", tip:"Pour connaitre quelqu'un"},
      {fr:"On devrait se revoir !",     en:"We should hang out!",ph:"wi shoud hang aout",  tip:"'Hang out' = passer du temps ensemble"},
    ],
    exercises:[
      {type:'trans',  q:"Tu viens d'ou ?",          a:"Where are you from?", hint:"wer ar you from"},
      {type:'fill',   q:"I'm ___ France",           a:"from",               hint:"from"},
      {type:'choice', q:"'What do you do?' signifie ?", a:"Qu'est-ce que tu fais dans la vie ?", opts:["Que fais-tu ?","Qu'est-ce que tu fais dans la vie ?","Qu'est-ce que tu fais ?","Comment tu t'en sors ?"]},
      {type:'fill',   q:"We should ___ out!",       a:"hang",               hint:"hang"},
      {type:'trans',  q:"Je viens de France",        a:"I'm from France",    hint:"aim from Frans"},
    ],
  },
  // THEME 2: CAFE & RESTO
  {
    id:3, theme:'Cafe & Resto', emoji:'☕', title:'Chez Starbucks', color:'#10b981', xp:30,
    samSays:"You're in New York at Starbucks. Say 'Can I get' — never 'I would like'. That sounds way too formal!",
    words:[
      {fr:"Un cafe s'il vous plait", en:"Can I get a coffee?", ph:"kan ai guet a kofi",  tip:"Can I get = formule magique US"},
      {fr:"Pour emporter",           en:"To go",               ph:"tou goh",             tip:"Pas take away — c'est British !"},
      {fr:"C'est combien ?",         en:"How much?",           ph:"hao match",           tip:"Simple et direct"},
      {fr:"Gardez la monnaie",       en:"Keep the change",     ph:"kip ze tcheinj",      tip:"Pourboire tres important aux USA"},
      {fr:"C'est delicieux !",       en:"So good!",            ph:"soh goud",            tip:"Les Americains exagerent toujours"},
    ],
    exercises:[
      {type:'choice', q:"Pour commander aux USA tu dis :", a:"Can I get a coffee?", opts:["I would like coffee","Can I get a coffee?","Give me coffee","Coffee please"]},
      {type:'fill',   q:"___ go (pour emporter)",         a:"To",                  hint:"tou"},
      {type:'trans',  q:"C'est combien ?",                a:"How much?",           hint:"hao match"},
      {type:'fill',   q:"Keep the ___",                   a:"change",              hint:"tcheinj"},
      {type:'choice', q:"C'est delicieux en americain ?", a:"So good!",            opts:["Very delicious!","So good!","It tastes well!","Yummy!"]},
    ],
  },
  {
    id:4, theme:'Cafe & Resto', emoji:'🍽️', title:'Au Restaurant', color:'#10b981', xp:30,
    samSays:"You're at a restaurant in Miami. American restaurants are casual — servers introduce themselves. Here's what you need!",
    words:[
      {fr:"On est prets a commander", en:"We're ready to order",   ph:"wir redi tou order",   tip:"Pour appeler le serveur"},
      {fr:"Qu'est-ce que vous recommandez ?", en:"What do you recommend?", ph:"wot dou you rekomend", tip:"Les Americains demandent ca souvent"},
      {fr:"Je vais prendre ca",        en:"I'll have that",          ph:"ail hav dat",          tip:"Naturel pour commander un plat"},
      {fr:"C'etait excellent",         en:"That was amazing",        ph:"dat woz ameizing",     tip:"Les Americains utilisent des superlatifs"},
      {fr:"L'addition s'il vous plait",en:"Check, please!",          ph:"tchek pliz",           tip:"Bill c'est British — dis Check"},
    ],
    exercises:[
      {type:'trans',  q:"On est prets a commander",    a:"We're ready to order",  hint:"wir redi tou order"},
      {type:'fill',   q:"I'll ___ that",               a:"have",                  hint:"hav"},
      {type:'choice', q:"Comment demander l'addition ?",a:"Check, please!",       opts:["Bill please!","Money now!","Check, please!","Pay time!"]},
      {type:'trans',  q:"C'etait excellent",            a:"That was amazing",      hint:"dat woz ameizing"},
      {type:'fill',   q:"What do you ___?",             a:"recommend",             hint:"rekomend"},
    ],
  },
  // THEME 3: TRANSPORT
  {
    id:5, theme:'Transport', emoji:'🚗', title:'Dans un Uber', color:'#8b5cf6', xp:30,
    samSays:"You're in an Uber in LA. Americans love friendly and direct people. Here's exactly what to say!",
    words:[
      {fr:"C'est vous mon chauffeur ?", en:"Are you my driver?",    ph:"ar you mai draiver",  tip:"Toujours confirmer le chauffeur"},
      {fr:"Tout droit",                 en:"Straight ahead",        ph:"streit a-hed",        tip:"Simple et clair"},
      {fr:"Tournez a gauche",           en:"Turn left",             ph:"tern left",           tip:"Court et efficace"},
      {fr:"C'est ici",                  en:"Right here",            ph:"rait hier",           tip:"Pour s'arreter ici"},
      {fr:"Merci pour la course",       en:"Thanks for the ride!",  ph:"thenks for ze raid",  tip:"Sourire + ces mots = 5 etoiles !"},
    ],
    exercises:[
      {type:'trans',  q:"C'est vous mon chauffeur ?",  a:"Are you my driver?",    hint:"ar you mai draiver"},
      {type:'choice', q:"Comment dire 'tout droit' ?", a:"Straight ahead",        opts:["Go forward","Straight ahead","Direct please","Continue road"]},
      {type:'fill',   q:"Turn ___",                   a:"left",                  hint:"left"},
      {type:'fill',   q:"___ here",                   a:"Right",                 hint:"rait"},
      {type:'trans',  q:"Merci pour la course",        a:"Thanks for the ride!",  hint:"thenks for ze raid"},
    ],
  },
  {
    id:6, theme:'Transport', emoji:'✈️', title:'A l'Aeroport', color:'#8b5cf6', xp:30,
    samSays:"You're at JFK airport in New York. Customs, check-in, boarding — I'll teach you everything!",
    words:[
      {fr:"Ou est l'enregistrement ?", en:"Where is check-in?",    ph:"wer iz tchek-in",      tip:"La premiere question a l'aeroport"},
      {fr:"J'ai un vol pour...",        en:"I have a flight to...", ph:"ai hav a flait tou",   tip:"Simple et direct pour se reperer"},
      {fr:"C'est pour affaires ou loisirs ?", en:"Business or pleasure?", ph:"biznes or plejer", tip:"La question des douanes americaines"},
      {fr:"Je n'ai rien a declarer",   en:"Nothing to declare",    ph:"nathing tou deklér",   tip:"Essentiel aux douanes"},
      {fr:"Ou est la porte d'embarquement ?", en:"Where is the gate?", ph:"wer iz ze geit",   tip:"Gate = porte d'embarquement"},
    ],
    exercises:[
      {type:'trans',  q:"Ou est l'enregistrement ?",  a:"Where is check-in?",    hint:"wer iz tchek-in"},
      {type:'fill',   q:"I have a ___ to Paris",      a:"flight",                hint:"flait"},
      {type:'choice', q:"'Business or pleasure?' c'est quoi ?", a:"Affaires ou loisirs ?", opts:["Travail ou plaisir ?","Affaires ou loisirs ?","Premiere ou economy ?","Seul ou en famille ?"]},
      {type:'fill',   q:"Nothing to ___",             a:"declare",               hint:"deklér"},
      {type:'trans',  q:"Ou est la porte d'embarquement ?", a:"Where is the gate?", hint:"wer iz ze geit"},
    ],
  },
  // THEME 4: TRAVAIL
  {
    id:7, theme:'Travail', emoji:'💼', title:'Au Bureau', color:'#0ea5e9', xp:35,
    samSays:"You're in an American company. These 5 phrases will make you sound like a total pro!",
    words:[
      {fr:"On fait le point ?",       en:"Can we catch up?",       ph:"kan wi katch ap",      tip:"Catch up = se mettre a jour"},
      {fr:"Je te tiens au courant",   en:"I'll keep you posted",   ph:"ail kip you pohsted",  tip:"Phrase cle en milieu pro US"},
      {fr:"C'est dans mes cordes",    en:"I'm on it",              ph:"aim on it",            tip:"Montre que tu prends en charge"},
      {fr:"Bien recu",                en:"Got it!",                ph:"got it",               tip:"Pour confirmer un message"},
      {fr:"Super boulot !",           en:"Great job!",             ph:"greit djob",           tip:"Les Americains complimentent beaucoup"},
    ],
    exercises:[
      {type:'trans',  q:"On fait le point ?",      a:"Can we catch up?",     hint:"kan wi katch ap"},
      {type:'fill',   q:"I'm ___ it",              a:"on",                   hint:"on"},
      {type:'choice', q:"Confirmer un message ?",  a:"Got it!",              opts:["Message received!","I understand!","Got it!","Confirmed!"]},
      {type:'fill',   q:"I'll keep you ___",       a:"posted",               hint:"pohsted"},
      {type:'trans',  q:"Super boulot !",           a:"Great job!",           hint:"greit djob"},
    ],
  },
  {
    id:8, theme:'Travail', emoji:'🤝', title:'En Reunion', color:'#0ea5e9', xp:35,
    samSays:"You're in a meeting with Americans. These phrases will make you shine in any professional setting!",
    words:[
      {fr:"Pour faire le point...",    en:"To recap...",              ph:"tou ri-kap",           tip:"Pour resumer ce qui a ete dit"},
      {fr:"Je voulais aborder...",     en:"I wanted to bring up...", ph:"ai wonted tou bring ap", tip:"Pour introduire un sujet"},
      {fr:"Est-ce que tout le monde est d'accord ?", en:"Is everyone on board?", ph:"iz evriwane on bord", tip:"Pour verifier le consensus"},
      {fr:"On se retrouve quand ?",    en:"When should we follow up?",ph:"wen shoud wi foloh ap", tip:"Follow up = donner suite"},
      {fr:"Je vais m'en occuper",      en:"I'll handle it",          ph:"ail handel it",        tip:"Pour prendre une responsabilite"},
    ],
    exercises:[
      {type:'fill',   q:"To ___... (pour faire le point)",  a:"recap",              hint:"ri-kap"},
      {type:'trans',  q:"Je voulais aborder...",             a:"I wanted to bring up...", hint:"ai wonted tou bring ap"},
      {type:'choice', q:"'On board' dans un contexte pro signifie :", a:"D'accord / partant",  opts:["Dans le bateau","D'accord / partant","Embarque","A bord"]},
      {type:'fill',   q:"When should we follow ___?",        a:"up",                 hint:"ap"},
      {type:'trans',  q:"Je vais m'en occuper",              a:"I'll handle it",     hint:"ail handel it"},
    ],
  },
  // THEME 5: SERIES & CULTURE
  {
    id:9, theme:'Series & Culture', emoji:'🎬', title:'Phrases de Series', color:'#f59e0b', xp:35,
    samSays:"This is my favorite! These phrases are in Friends, Breaking Bad, Stranger Things — ALL the time!",
    words:[
      {fr:"T'es serieux la ?",     en:"Are you kidding me?",  ph:"ar you kid-ing mi",   tip:"Surprise ou incredulite — tres utilise"},
      {fr:"Laisse tomber",         en:"Never mind",           ph:"ne-ver maind",        tip:"Pour clore un sujet"},
      {fr:"C'est pas vrai !",      en:"No way!",              ph:"noh wei",             tip:"Surprise positive OU negative"},
      {fr:"J'en sais rien",        en:"I have no idea",       ph:"ai hav noh ai-dia",   tip:"Plus naturel que I don't know"},
      {fr:"C'est dingue !",        en:"That's crazy!",        ph:"dats krei-zi",        tip:"Positif ou negatif selon contexte"},
    ],
    exercises:[
      {type:'choice', q:"Tu es surpris. Tu dis :",          a:"Are you kidding me?",  opts:["Really true?","Are you kidding me?","Is this real?","No seriously?"]},
      {type:'fill',   q:"Never ___",                        a:"mind",                 hint:"maind"},
      {type:'trans',  q:"C'est pas vrai !",                 a:"No way!",              hint:"noh wei"},
      {type:'choice', q:"J'en sais rien naturellement :",   a:"I have no idea",       opts:["I don't know nothing","I have no idea","I know not","No idea have I"]},
      {type:'fill',   q:"That's ___!",                      a:"crazy",                hint:"krei-zi"},
    ],
  },
  {
    id:10, theme:'Series & Culture', emoji:'🎮', title:'Pop Culture US', color:'#f59e0b', xp:35,
    samSays:"Sports, gaming, movies — Americans talk about pop culture ALL the time. You need to understand these!",
    words:[
      {fr:"C'est le match decisif !", en:"It's game time!",       ph:"its geim taim",        tip:"Game time = moment decisif, du sport"},
      {fr:"Il gere !",                en:"He's killing it!",      ph:"hiz kil-ing it",       tip:"Killing it = exceller dans quelque chose"},
      {fr:"Je regarde ca en binge",   en:"I'm binge-watching it", ph:"aim bindj-watching it", tip:"Regarder toute une serie d'un coup"},
      {fr:"C'est un spoiler !",       en:"That's a spoiler!",     ph:"dats a spoil-er",      tip:"Reveler la fin — interdit !"},
      {fr:"Ca m'a pris aux tripes",   en:"It gave me goosebumps", ph:"it geiv mi gous-bamps", tip:"Goosebumps = chair de poule"},
    ],
    exercises:[
      {type:'fill',   q:"It's ___ time! (match decisif)",   a:"game",                 hint:"geim"},
      {type:'trans',  q:"Il gere !",                         a:"He's killing it!",     hint:"hiz kiling it"},
      {type:'choice', q:"'Binge-watching' c'est quoi ?",    a:"Regarder toute une serie d'un coup", opts:["Regarder a deux","Regarder toute une serie d'un coup","Regarder en vitesse","Regarder en avance"]},
      {type:'fill',   q:"That's a ___! (spoiler)",          a:"spoiler",              hint:"spoil-er"},
      {type:'trans',  q:"Ca m'a pris aux tripes",            a:"It gave me goosebumps",hint:"it geiv mi gous-bamps"},
    ],
  },
  // THEME 6: SLANG
  {
    id:11, theme:'Slang', emoji:'🔥', title:'Vrai Slang US', color:'#ec4899', xp:40,
    samSays:"The English they DON'T teach you in school! Real Americans use these every single day!",
    words:[
      {fr:"C'est incroyable !",    en:"That's fire!",      ph:"dats faier",    tip:"Fire = excellent — utilise par tout le monde"},
      {fr:"Sans mentir",           en:"No cap",            ph:"noh kap",       tip:"No cap = for real, sans mentir"},
      {fr:"C'est vrai",            en:"Facts",             ph:"fakts",         tip:"Juste 'Facts.' tout seul pour approuver"},
      {fr:"Je te soutiens",        en:"I got you",         ph:"ai got you",    tip:"Je suis la pour toi"},
      {fr:"C'est fou !",           en:"That's wild!",      ph:"dats waild",    tip:"Pour quelque chose de surprenant"},
    ],
    exercises:[
      {type:'choice', q:"'C'est incroyable' en slang US :", a:"That's fire!", opts:["That's very good!","That's fire!","Wow amazing!","Super great!"]},
      {type:'fill',   q:"___ (pour dire c'est vrai)",       a:"Facts",        hint:"fakts"},
      {type:'trans',  q:"Je te soutiens",                    a:"I got you",    hint:"ai got you"},
      {type:'fill',   q:"That's ___ ! (c'est fou)",         a:"wild",         hint:"waild"},
      {type:'choice', q:"'No cap' signifie :",              a:"Sans mentir",  opts:["Pas de chapeau","Sans mentir","Aucun probleme","C'est gratuit"]},
    ],
  },
  {
    id:12, theme:'Slang', emoji:'💅', title:'Gen Z Americain', color:'#ec4899', xp:40,
    samSays:"This is the newest slang! The words Gen Z Americans use RIGHT NOW in 2024. Super trendy!",
    words:[
      {fr:"C'est cool/stylé",      en:"It's lowkey fire",      ph:"its lohki faier",    tip:"Lowkey = un peu, discretement"},
      {fr:"Dramatiser",            en:"Being extra",           ph:"bi-ing extra",       tip:"Extra = exagere, theatral"},
      {fr:"C'est authentique",     en:"That's real",           ph:"dats riel",          tip:"Pour valider quelque chose de vrai"},
      {fr:"Il/elle assure",        en:"They're a vibe",        ph:"their a vaib",       tip:"Vibe = ambiance, energie positive"},
      {fr:"Passe a autre chose",   en:"Move on",               ph:"mouv on",            tip:"Tres utilise pour dire d'avancer"},
    ],
    exercises:[
      {type:'choice', q:"'Being extra' signifie ?",           a:"Exagerer / theatraliser", opts:["Etre en plus","Exagerer / theatraliser","Avoir plus","Faire extra"]},
      {type:'fill',   q:"They're a ___",                      a:"vibe",                    hint:"vaib"},
      {type:'trans',  q:"Passe a autre chose",                 a:"Move on",                 hint:"mouv on"},
      {type:'fill',   q:"It's lowkey ___",                    a:"fire",                    hint:"faier"},
      {type:'choice', q:"'That's real' dans le slang Gen Z ?",a:"C'est authentique / vrai",opts:["C'est reel","C'est authentique / vrai","C'est la realite","C'est vrai ca"]},
    ],
  },
  // THEME 7: EMOTIONS
  {
    id:13, theme:'Emotions', emoji:'😄', title:'Les Emotions', color:'#f97316', xp:35,
    samSays:"Americans are VERY expressive! They don't say 'I am happy' — they say 'I'm SO pumped!' Big energy!",
    words:[
      {fr:"Je suis trop content !",  en:"I'm stoked!",          ph:"aim stohkt",        tip:"Stoked = tres excite — typiquement americain"},
      {fr:"Je suis fatigue",         en:"I'm beat",             ph:"aim bit",           tip:"Plus naturel que I'm tired"},
      {fr:"Ca m'enerve !",           en:"That ticks me off!",   ph:"dat tiks mi of",    tip:"Expression imagee tres courante"},
      {fr:"J'ai le cafard",          en:"I'm down",             ph:"aim daoun",         tip:"Pas I'm sad — I'm down c'est naturel"},
      {fr:"Je suis aux anges !",     en:"I'm over the moon!",   ph:"aim ohver ze moun", tip:"Pour la joie extreme"},
    ],
    exercises:[
      {type:'choice', q:"'Je suis trop content' americain :", a:"I'm stoked!",   opts:["I'm very happy!","I'm stoked!","I am joyful!","I feel good!"]},
      {type:'fill',   q:"I'm ___ (fatigue)",                  a:"beat",          hint:"bit"},
      {type:'trans',  q:"J'ai le cafard",                      a:"I'm down",      hint:"aim daoun"},
      {type:'fill',   q:"I'm over the ___!",                  a:"moon",          hint:"moun"},
      {type:'trans',  q:"Ca m'enerve !",                       a:"That ticks me off!", hint:"dat tiks mi of"},
    ],
  },
  {
    id:14, theme:'Emotions', emoji:'💪', title:'Donner Confiance', color:'#f97316', xp:35,
    samSays:"Americans are masters at encouraging and motivating each other. Learn these phrases and people will love you!",
    words:[
      {fr:"Tu peux le faire !",       en:"You got this!",          ph:"you got dis",          tip:"La phrase de motivation N1 en Amerique"},
      {fr:"Je crois en toi",          en:"I believe in you",       ph:"ai biliv in you",      tip:"Puissant et sincere"},
      {fr:"T'inquiete pas",           en:"Don't sweat it",         ph:"dont swet it",         tip:"Sweat = suer — ne t'en fais pas"},
      {fr:"C'est ton moment !",       en:"This is your time!",     ph:"dis iz yor taim",      tip:"Pour encourager avant un grand moment"},
      {fr:"Tu assures !",             en:"You're crushing it!",    ph:"yor krashing it",      tip:"Crushing it = etre en train d'exceller"},
    ],
    exercises:[
      {type:'trans',  q:"Tu peux le faire !",        a:"You got this!",       hint:"you got dis"},
      {type:'fill',   q:"I ___ in you (je crois en toi)", a:"believe",       hint:"biliv"},
      {type:'choice', q:"'Don't sweat it' signifie ?", a:"T'inquiete pas",  opts:["Ne transpire pas","T'inquiete pas","Ne pleure pas","Ca ira"]},
      {type:'fill',   q:"This is your ___!",          a:"time",             hint:"taim"},
      {type:'trans',  q:"Tu assures !",               a:"You're crushing it!", hint:"yor krashing it"},
    ],
  },
  // THEME 8: SONS & PRONONCIATION
  {
    id:15, theme:'Prononciation', emoji:'🗣️', title:'Sons Americains', color:'#6366f1', xp:40,
    samSays:"This lesson is SUPER important. The 5 sounds that will transform your accent completely. Listen carefully!",
    words:[
      {fr:"Le T qui devient D",    en:"Water = Wah-der",      ph:"woh-der",    tip:"En americain le T entre voyelles sonne comme D"},
      {fr:"Le son TH",             en:"Think = Thinnk",       ph:"thinnk",     tip:"Pose la langue entre les dents et souffle"},
      {fr:"Le R americain",        en:"Really = Rilly",       ph:"rili",       tip:"Le R vient du fond de la gorge"},
      {fr:"Gonna et Wanna",        en:"Going to = Gonna",     ph:"gon-na",     tip:"Going to devient toujours gonna a l'oral"},
      {fr:"Reduction de you",      en:"See you = See ya",     ph:"si ya",      tip:"Les Americains avalent les sons"},
    ],
    exercises:[
      {type:'choice', q:"Americain prononce 'water' ?",  a:"Woh-der",              opts:["Wah-ter","Woh-der","Vater","Wouater"]},
      {type:'choice', q:"Le son TH dans 'think' ?",       a:"Langue entre les dents",opts:["Un S francais","Un Z","Langue entre les dents","Un T dur"]},
      {type:'choice', q:"'Going to' a l'oral devient ?",  a:"Gonna",               opts:["Going to","Go to","Gonna","Goin"]},
      {type:'fill',   q:"See ___ (a plus)",               a:"ya",                  hint:"ya"},
      {type:'choice', q:"Le R americain vient ?",         a:"Du fond de la gorge",  opts:["Du bout des levres","Du fond de la gorge","Des dents","Du nez"]},
    ],
  },
  {
    id:16, theme:'Prononciation', emoji:'🎵', title:'Rythme et Melodie', color:'#6366f1', xp:40,
    samSays:"English music has a rhythm — Americans speak with a melody. I'll teach you to sound natural and fluid!",
    words:[
      {fr:"Contractions naturelles",  en:"I'm gonna do it",       ph:"aim gona dou it",     tip:"Gonna = going to — toujours en parle"},
      {fr:"Accentuation americaine",  en:"I LOVE New York",       ph:"ai LUV nyou york",    tip:"Les Americains accentuent fortement"},
      {fr:"Enchainement de mots",     en:"Whaddya want?",         ph:"wod-ya wont",         tip:"What do you devient whaddya en rapide"},
      {fr:"Ton montant",              en:"Really? — intonation",  ph:"rili — ton montant",  tip:"Les Americains montent la voix pour la surprise"},
      {fr:"Filler naturel",           en:"Like... you know...",   ph:"laik... you noh...",  tip:"Like est le mot le plus parle en anglais US"},
    ],
    exercises:[
      {type:'choice', q:"'I'm gonna' c'est quoi ?",         a:"I'm going to",      opts:["I am gonna","I'm going to","I will go","I'm going"]},
      {type:'fill',   q:"'Whaddya want?' vient de 'What ___ you want?'", a:"do",  hint:"dou"},
      {type:'choice', q:"L'accentuation americaine ?",       a:"On accentue fortement les mots importants", opts:["Tout egal","On accentue fortement les mots importants","On murmure","On parle vite"]},
      {type:'fill',   q:"___ you know... (filler naturel)", a:"Like",              hint:"laik"},
      {type:'choice', q:"Le ton montant en fin de phrase ?", a:"Marque la question ou surprise", opts:["Marque la colere","Marque la question ou surprise","Marque la joie","Marque le doute"]},
    ],
  },
  // THEME 9: CONVERSATION REELLE
  {
    id:17, theme:'Conversation', emoji:'💬', title:'Parler Sans Reflechir', color:'#14b8a6', xp:45,
    samSays:"Lesson 17 — you're becoming a real speaker! These are the automatic phrases that flow naturally.",
    words:[
      {fr:"Honnetement...",          en:"Honestly...",             ph:"on-es-tli",          tip:"Pour introduire une opinion sincere"},
      {fr:"Tu vois ce que je veux dire ?", en:"You know what I mean?", ph:"you noh wot ai min", tip:"Les Americains disent ca tout le temps"},
      {fr:"Euh... (pour reflechir)", en:"I mean...",               ph:"ai min",             tip:"Pour gagner du temps naturellement"},
      {fr:"Absolument !",            en:"Totally!",                ph:"toh-tali",           tip:"Bien plus americain que Yes absolutely"},
      {fr:"Ca m'a l'air bien",       en:"Sounds good!",            ph:"saoundz goud",       tip:"Pour accepter une proposition"},
    ],
    exercises:[
      {type:'trans',  q:"Honnetement...",               a:"Honestly...",          hint:"on-es-tli"},
      {type:'fill',   q:"You know what I ___?",         a:"mean",                hint:"min"},
      {type:'choice', q:"'Ca m'a l'air bien' ?",        a:"Sounds good!",        opts:["Looks well!","Sounds good!","Seems nice!","Appears okay!"]},
      {type:'fill',   q:"___! (absolument)",            a:"Totally",             hint:"toh-tali"},
      {type:'trans',  q:"Tu vois ce que je veux dire ?",a:"You know what I mean?",hint:"you noh wot ai min"},
    ],
  },
  {
    id:18, theme:'Conversation', emoji:'🗽', title:'Culture Americaine', color:'#14b8a6', xp:45,
    samSays:"To truly speak American, you need to understand American culture. These references will make you blend in!",
    words:[
      {fr:"C'est dans la poche",     en:"It's in the bag",          ph:"its in ze bag",        tip:"Signifie que c'est gagne d'avance"},
      {fr:"Le moment de verite",     en:"It's game time",           ph:"its geim taim",        tip:"Reference sportive — tres americaine"},
      {fr:"Revenir a l'essentiel",   en:"Back to basics",           ph:"bak tou bei-siks",     tip:"Tres utilise en business americain"},
      {fr:"Donner une chance",       en:"Give it a shot",           ph:"giv it a shot",        tip:"Shot = tentative — du sport ou chasse"},
      {fr:"Ca va dans tous les sens",en:"It's all over the place",  ph:"its ol oh-ver ze pleis", tip:"Pour dire que c'est desorganise"},
    ],
    exercises:[
      {type:'trans',  q:"C'est dans la poche",           a:"It's in the bag",      hint:"its in ze bag"},
      {type:'fill',   q:"Back to ___",                   a:"basics",               hint:"bei-siks"},
      {type:'choice', q:"'Give it a shot' signifie ?",   a:"Essaie-le",            opts:["Tire dessus","Essaie-le","Donne-lui un coup","Lance-le"]},
      {type:'fill',   q:"It's all over the ___",         a:"place",                hint:"pleis"},
      {type:'trans',  q:"Le moment de verite",            a:"It's game time",       hint:"its geim taim"},
    ],
  },
  // THEME 10: ACCENT PARFAIT
  {
    id:19, theme:'Accent Parfait', emoji:'*', title:'Sonner Comme un Natif', color:'#ef4444', xp:50,
    samSays:"This is elite level! The last 5% that separates good English from PERFECT English. Pay attention!",
    words:[
      {fr:"Contractions fluides",    en:"Gonna, Wanna, Gotta",     ph:"gona wona gota",      tip:"Going to, want to, got to — contracte TOUJOURS"},
      {fr:"Ton decontracte",         en:"Yeah, for sure",          ph:"ye for shor",         tip:"Le ton americain — ni formel ni trop familier"},
      {fr:"Reduire him/her",         en:"Tell 'im / Ask 'er",      ph:"tel-im / ask-er",     tip:"Him devient im, her devient er a l'oral rapide"},
      {fr:"Accentuation emotion",    en:"I LOVE that!",            ph:"ai LUV dat",          tip:"Les Americains accentuent les mots emotionnels"},
      {fr:"Pause naturelle",         en:"So... yeah...",           ph:"soh... ye...",        tip:"Pour rendre son anglais plus naturel et humain"},
    ],
    exercises:[
      {type:'choice', q:"'Gonna' vient de quoi ?",       a:"Going to",             opts:["Go now","Going to","Gonna go","I go"]},
      {type:'fill',   q:"Yeah, for ___",                 a:"sure",                 hint:"shor"},
      {type:'choice', q:"'Tell 'im' c'est quoi ?",       a:"Tell him",             opts:["Tell I'm","Tell him","Tell them","Tell me"]},
      {type:'fill',   q:"I ___ that! (avec accent fort)", a:"LOVE",               hint:"LAV"},
      {type:'choice', q:"Pourquoi dire 'So... yeah...' ?",a:"Pour parler plus naturellement", opts:["Pour gagner du temps","Pour parler plus naturellement","Pour etre poli","Pour stresser"]},
    ],
  },
  {
    id:20, theme:'Accent Parfait', emoji:'👑', title:'Maitre de l'Anglais US', color:'#ef4444', xp:60,
    samSays:"FINAL LESSON! You've made it to lesson 20. This is the ultimate American conversation. YOU are ready!",
    words:[
      {fr:"Je suis completement d'accord", en:"I couldn't agree more",  ph:"ai koudnt agri more",  tip:"Plus fort que I agree — marqueur de conviction"},
      {fr:"Precisement !",            en:"Exactly! / Spot on!",      ph:"egzaktli / spot on",   tip:"Spot on = parfaitement juste — tres americain"},
      {fr:"Ca me depasse",            en:"It's beyond me",           ph:"its bi-yond mi",       tip:"Pour dire qu'on ne comprend pas"},
      {fr:"C'est exactement ca",      en:"That's the thing",         ph:"dats ze thing",        tip:"Pour confirmer l'essentiel d'une idee"},
      {fr:"Pour etre honnete avec toi",en:"Not gonna lie...",        ph:"not gona lai",         tip:"Pour introduire quelque chose de sincere"},
    ],
    exercises:[
      {type:'trans',  q:"Je suis completement d'accord",  a:"I couldn't agree more",  hint:"ai koudnt agri more"},
      {type:'fill',   q:"Exactly! / Spot ___!",           a:"on",                     hint:"on"},
      {type:'choice', q:"'It's beyond me' signifie ?",    a:"Ca me depasse",           opts:["C'est derriere moi","Ca me depasse","C'est trop loin","Au-dela de moi"]},
      {type:'fill',   q:"That's the ___",                 a:"thing",                  hint:"thing"},
      {type:'trans',  q:"Pour etre honnete avec toi",      a:"Not gonna lie...",        hint:"not gona lai"},
    ],
  },
];

// CULTURE FACTS
const CULTURE_FACTS = [
  {emoji:"🦃", title:"Thanksgiving", text:"Chaque 4e jeudi de novembre, les Americains mangent de la dinde en famille. C'est aussi le jour des embouteillages les plus importants des USA !"},
  {emoji:"🏈", title:"Super Bowl", text:"Le Super Bowl est le match de football americain le plus regarde. Les publicites du Super Bowl coutent 7 millions $ pour 30 secondes !"},
  {emoji:"🍔", title:"Tip Culture", text:"Aux USA, laisser 15-20% de pourboire est OBLIGATOIRE au restaurant. Ne pas laisser de tip est tres mal vu."},
  {emoji:"☕", title:"Starbucks Culture", text:"Le prepose ecrit ton prenom sur le verre. Dis toujours ton prenom clairement ! Les americains vont tres souvent chez Starbucks."},
  {emoji:"🏥", title:"Small Talk", text:"Les Americains font du small talk partout — dans l'ascenseur, chez le medecin, dans la file. C'est normal et attendu !"},
  {emoji:"🎃", title:"Halloween", text:"Le 31 octobre, des enfants deguises frappent aux portes en criant 'Trick or treat!' pour avoir des bonbons. Tres populaire !"},
  {emoji:"🗽", title:"Melting Pot", text:"Les USA sont appeles le 'melting pot' — une societe composee d'immigrants du monde entier. Chaque Americain a des origines differentes."},
  {emoji:"🎓", title:"College Life", text:"L'universite americaine est une experience de vie — les etudiants habitent sur le campus, font des frats, des sororities. C'est tout un monde !"},
];

// XP LEVELS
const XP_LEVELS = [
  {name:'Zero',       emoji:'🥚', color:'#94a3b8', min:0},
  {name:'Touriste',   emoji:'🧳', color:'#10b981', min:100},
  {name:'Voyageur',   emoji:'✈',  color:'#3b82f6', min:300},
  {name:'Resident',   emoji:'🏠', color:'#8b5cf6', min:700},
  {name:'Local',      emoji:'🗽', color:'#f59e0b', min:1300},
  {name:'Americain',  emoji:'★',  color:'#ef4444', min:2000},
];

function getXPLevel(xp){let l=XP_LEVELS[0];for(const lv of XP_LEVELS){if(xp>=lv.min)l=lv;}return l;}
function getNextXP(xp){for(let i=XP_LEVELS.length-1;i>=0;i--){if(xp>=XP_LEVELS[i].min)return XP_LEVELS[Math.min(i+1,XP_LEVELS.length-1)];}return XP_LEVELS[1];}

function checkBadges(user, completed){
  const badges = [];
  if(completed.length>=1) badges.push('first');
  if(user.streak>=3) badges.push('streak3');
  if(user.streak>=7) badges.push('streak7');
  if(user.xp>=100) badges.push('xp100');
  if(user.xp>=500) badges.push('xp500');
  if(user.xp>=1000) badges.push('xp1000');
  if(completed.length>=5) badges.push('lesson5');
  if(completed.length>=10) badges.push('lesson10');
  if(completed.length>=20) badges.push('lesson20');
  return badges;
}

// UTILS
function speak(text, speed, onEnd){
  if(!window.speechSynthesis){if(onEnd)onEnd();return;}
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text.replace(/[=→↗]/g,''));
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
        o.frequency.value=f;o.type='sine';
        g.gain.setValueAtTime(0.2,ctx.currentTime+i*0.12);
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
      o.frequency.value=f;o.type='sine';
      g.gain.setValueAtTime(0,ctx.currentTime+i*0.14);
      g.gain.linearRampToValueAtTime(0.18,ctx.currentTime+i*0.14+0.05);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.14+0.32);
      o.start(ctx.currentTime+i*0.14);o.stop(ctx.currentTime+i*0.14+0.38);
    });
  }catch(e){}
}

function shuffle(a){return[...a].sort(()=>Math.random()-0.5);}
const rand=(a)=>a[Math.floor(Math.random()*a.length)];
const SAM_WIN=["Perfect! That's exactly right!","Yes!! You sound American!","Amazing! Keep going!","That's it! I'm proud of you!","Excellent! You're crushing it!"];
const SAM_TRY=["Not quite — but you're close!","Almost! Listen one more time.","Don't give up! Every mistake is progress!","Keep going — you've got this!"];

// ACCESS SCREEN
function Access({onDone}){
  const [code,setCode]=useState('');
  const [err,setErr]=useState('');
  const submit=()=>{
    if(CODES[code.trim().toUpperCase()]){onDone();}
    else{setErr('Code invalide. Verifie ton invitation.');setCode('');}
  };
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0a0a14 0%,#0f172a 50%,#1a0a2e 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px 20px',gap:'16px',textAlign:'center',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',width:'400px',height:'400px',borderRadius:'50%',background:'radial-gradient(circle,rgba(239,68,68,0.12) 0%,transparent 70%)',top:'10%',left:'50%',transform:'translateX(-50%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',width:'200px',height:'200px',borderRadius:'50%',background:'radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 70%)',bottom:'20%',right:'10%',pointerEvents:'none'}}/>
      <div style={{fontSize:'68px',lineHeight:1,filter:'drop-shadow(0 0 24px rgba(239,68,68,0.6))'}}>🎙️</div>
      <h1 style={{color:'#fff',fontSize:'46px',fontWeight:900,letterSpacing:'-2.5px',margin:0,lineHeight:1}}>TalkReal</h1>
      <p style={{color:'#ef4444',fontSize:'11px',fontWeight:700,letterSpacing:'4px',textTransform:'uppercase',margin:0}}>AVEC PROF SAM</p>
      <p style={{color:'#334155',fontSize:'13px',lineHeight:1.7,margin:'4px 0 12px',maxWidth:'280px'}}>Ton coach americain personnel.<br/>Il t'apprend. Tu repetes. Tu parles.</p>
      <div style={{background:'rgba(255,255,255,0.03)',backdropFilter:'blur(20px)',borderRadius:'24px',padding:'28px 22px',width:'100%',maxWidth:'340px',border:'1px solid rgba(255,255,255,0.08)',boxShadow:'0 20px 60px rgba(0,0,0,0.4)'}}>
        <p style={{color:'#475569',fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',margin:'0 0 10px'}}>Code d'acces beta</p>
        <input value={code} onChange={e=>{setCode(e.target.value.toUpperCase());setErr('');}}
          onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="Ex: TALKREAL2024"
          style={{width:'100%',padding:'14px',fontSize:'17px',fontWeight:800,borderRadius:'12px',border:err?'2px solid #ef4444':'2px solid rgba(255,255,255,0.08)',background:'rgba(0,0,0,0.4)',color:'#fff',outline:'none',letterSpacing:'3px',textAlign:'center',boxSizing:'border-box',marginBottom:'8px'}}/>
        {err&&<p style={{color:'#ef4444',fontSize:'12px',margin:'0 0 8px'}}>{err}</p>}
        <button onClick={submit} style={{width:'100%',padding:'15px',background:'linear-gradient(135deg,#ef4444,#ec4899)',color:'#fff',border:'none',borderRadius:'12px',fontSize:'15px',fontWeight:800,cursor:'pointer',boxShadow:'0 8px 24px rgba(239,68,68,0.35)',transition:'all 0.2s'}}>
          Entrer dans TalkReal →
        </button>
      </div>
      <p style={{color:'rgba(255,255,255,0.08)',fontSize:'12px',margin:0}}>Acces sur invitation uniquement</p>
    </div>
  );
}

// ONBOARDING
function Onboard({onDone}){
  const [step,setStep]=useState(0);
  const [name,setName]=useState('');
  const [age,setAge]=useState('');
  const [level,setLevel]=useState(null);

  const pickLevel=(lv)=>{setLevel(lv);setStep(2);setTimeout(()=>jingle(),300);};

  if(step===0)return(
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px 20px',gap:'14px'}}>
      <div style={{fontSize:'52px'}}>👋</div>
      <h2 style={{fontSize:'26px',fontWeight:900,color:'#111',margin:0}}>Bienvenue sur TalkReal !</h2>
      <p style={{color:'#94a3b8',fontSize:'14px',textAlign:'center',margin:0,lineHeight:1.6}}>2 infos rapides et Prof Sam<br/>s'occupe du reste</p>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ton prenom..." autoFocus
        style={{width:'100%',maxWidth:'300px',padding:'15px 20px',fontSize:'17px',fontWeight:700,borderRadius:'16px',border:'2px solid #e2e8f0',outline:'none',textAlign:'center',color:'#111',transition:'border-color 0.2s'}}/>
      <input type="number" value={age} onChange={e=>setAge(e.target.value)} placeholder="Ton age..." min="10" max="99"
        style={{width:'150px',padding:'15px 20px',fontSize:'17px',fontWeight:700,borderRadius:'16px',border:'2px solid #e2e8f0',outline:'none',textAlign:'center',color:'#111'}}/>
      <button onClick={()=>setStep(1)} disabled={!name.trim()||!age||parseInt(age)<10}
        style={{background:name.trim()&&age&&parseInt(age)>=10?'linear-gradient(135deg,#ef4444,#ec4899)':'#e2e8f0',color:name.trim()&&age&&parseInt(age)>=10?'#fff':'#94a3b8',border:'none',borderRadius:'16px',padding:'16px 32px',fontSize:'16px',fontWeight:800,cursor:name.trim()&&age&&parseInt(age)>=10?'pointer':'not-allowed',width:'100%',maxWidth:'300px',boxShadow:name.trim()&&age?'0 6px 20px rgba(239,68,68,0.3)':'none',transition:'all 0.2s'}}>
        Continuer →
      </button>
    </div>
  );

  if(step===1)return(
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',flexDirection:'column',padding:'40px 20px 32px'}}>
      <div style={{textAlign:'center',marginBottom:'24px'}}>
        <div style={{fontSize:'32px',fontWeight:900,color:'#111'}}>Hey {name} !</div>
        <div style={{color:'#94a3b8',fontSize:'14px',marginTop:'6px'}}>Ton niveau d'anglais actuel ?</div>
        <div style={{color:'#cbd5e1',fontSize:'12px',marginTop:'2px'}}>Sam adapte tout pour toi — sois honnete !</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
        {LEVELS.map(lv=>(
          <button key={lv.id} onClick={()=>pickLevel(lv)}
            style={{background:'#fff',border:'2px solid #e2e8f0',borderRadius:'20px',padding:'16px 18px',display:'flex',alignItems:'center',gap:'14px',cursor:'pointer',textAlign:'left',boxShadow:'0 2px 8px rgba(0,0,0,0.04)',transition:'all 0.15s'}}>
            <div style={{width:'52px',height:'52px',borderRadius:'14px',background:lv.color+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'26px',flexShrink:0}}>{lv.emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:'15px',color:'#111'}}>{lv.label}</div>
              <div style={{color:'#94a3b8',fontSize:'12px',marginTop:'2px'}}>{lv.desc}</div>
            </div>
            <div style={{color:'#e2e8f0',fontSize:'18px'}}>→</div>
          </button>
        ))}
      </div>
    </div>
  );

  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#080810,#0f172a)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px 20px',gap:'20px',textAlign:'center'}}>
      <div style={{fontSize:'80px',lineHeight:1}}>🎙️</div>
      <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'24px',padding:'24px 28px',maxWidth:'320px'}}>
        <div style={{color:'#ef4444',fontSize:'11px',fontWeight:700,letterSpacing:'2px',marginBottom:'10px'}}>PROF SAM</div>
        <div style={{color:'#fff',fontSize:'15px',lineHeight:1.7,fontStyle:'italic'}}>
          "Hey {name}! I'm Sam — your personal American English coach. I'm gonna teach you to speak like a real American. The REAL stuff. Not the boring school version. Ready? Let's GO!"
        </div>
      </div>
      <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'18px',padding:'16px 20px',maxWidth:'300px',width:'100%'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
          <span style={{color:'#475569',fontSize:'12px'}}>Niveau</span>
          <span style={{color:level?level.color:'#fff',fontSize:'12px',fontWeight:700}}>{level?level.emoji+' '+level.label:''}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
          <span style={{color:'#475569',fontSize:'12px'}}>Lecons</span>
          <span style={{color:'#fff',fontSize:'12px',fontWeight:700}}>20 lecons + exercices</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <span style={{color:'#475569',fontSize:'12px'}}>Badges</span>
          <span style={{color:'#fff',fontSize:'12px',fontWeight:700}}>12 badges a debloquer</span>
        </div>
      </div>
      <button onClick={()=>onDone({name,age:parseInt(age),level})}
        style={{background:'linear-gradient(135deg,#ef4444,#ec4899)',color:'#fff',border:'none',borderRadius:'16px',padding:'17px 44px',fontSize:'17px',fontWeight:900,cursor:'pointer',boxShadow:'0 8px 30px rgba(239,68,68,0.4)'}}>
        C'est parti avec Sam ! 🚀
      </button>
    </div>
  );
}


// HOME with tabs: Lessons | Badges | Leaderboard | Culture
function Home({user,completed,onSelect,onTab}){
  const [tab,setTab]=useState('lessons');
  const xpLv=getXPLevel(user.xp);
  const nextXP=getNextXP(user.xp);
  const pct=nextXP.min>xpLv.min?Math.min(100,((user.xp-xpLv.min)/(nextXP.min-xpLv.min))*100):100;
  const earnedBadges=checkBadges(user,completed);
  const themes=[...new Set(LESSONS.map(l=>l.theme))];

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'#f8fafc'}}>
      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',padding:'24px 20px 16px',flexShrink:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'14px'}}>
          <div>
            <div style={{color:'#475569',fontSize:'12px'}}>Bonjour 👋</div>
            <div style={{color:'#fff',fontSize:'24px',fontWeight:900,letterSpacing:'-0.5px'}}>{user.name}</div>
            <div style={{display:'flex',gap:'6px',marginTop:'5px',flexWrap:'wrap'}}>
              <span style={{background:user.level.color+'22',color:user.level.color,borderRadius:'8px',padding:'2px 10px',fontSize:'11px',fontWeight:700}}>{user.level.emoji} {user.level.label}</span>
              <span style={{background:'rgba(255,255,255,0.06)',color:'#64748b',borderRadius:'8px',padding:'2px 10px',fontSize:'11px',fontWeight:600}}>{earnedBadges.length} badges</span>
            </div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{background:'rgba(255,255,255,0.06)',borderRadius:'12px',padding:'8px 12px',textAlign:'center'}}>
              <div style={{fontSize:'20px'}}>🔥</div>
              <div style={{color:'#fff',fontSize:'16px',fontWeight:900}}>{user.streak}</div>
              <div style={{color:'#475569',fontSize:'9px'}}>jours</div>
            </div>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
          <span style={{color:'#475569',fontSize:'11px'}}>{xpLv.emoji} {xpLv.name}</span>
          <span style={{color:'#334155',fontSize:'11px'}}>{user.xp} XP</span>
        </div>
        <div style={{height:'6px',background:'rgba(255,255,255,0.06)',borderRadius:'99px'}}>
          <div style={{height:'100%',width:pct+'%',background:'linear-gradient(90deg,'+xpLv.color+','+nextXP.color+')',borderRadius:'99px',transition:'width 0.8s ease'}}/>
        </div>
        <div style={{color:'#334155',fontSize:'10px',marginTop:'3px',textAlign:'right'}}>
          {nextXP.min>xpLv.min?'→ '+nextXP.emoji+' '+nextXP.name+' dans '+(nextXP.min-user.xp)+' XP':'NIVEAU MAX !'}
        </div>
      </div>

      {/* Bottom tabs */}
      <div style={{background:'#fff',borderBottom:'1px solid #f1f5f9',padding:'0 16px',flexShrink:0,display:'flex',gap:'0',overflowX:'auto'}}>
        {[['lessons','📚','Leçons'],['badges','🏆','Badges'],['rank','👑','Classement'],['culture','🗽','Culture']].map(([key,ico,label])=>(
          <button key={key} onClick={()=>setTab(key)}
            style={{flex:1,padding:'12px 4px',background:'none',border:'none',borderBottom:tab===key?'3px solid #ef4444':'3px solid transparent',cursor:'pointer',fontSize:'11px',fontWeight:tab===key?800:600,color:tab===key?'#ef4444':'#94a3b8',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',transition:'all 0.2s',whiteSpace:'nowrap',minWidth:'70px'}}>
            <span style={{fontSize:'16px'}}>{ico}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{flex:1,overflowY:'auto'}}>
        {tab==='lessons'&&(
          <div style={{padding:'16px'}}>
            {/* Progress */}
            <div style={{background:'#fff',borderRadius:'18px',padding:'14px 18px',marginBottom:'16px',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                <span style={{fontWeight:800,fontSize:'14px',color:'#111'}}>Ta progression</span>
                <span style={{fontWeight:700,fontSize:'13px',color:'#ef4444'}}>{completed.length}/20</span>
              </div>
              <div style={{height:'8px',background:'#f1f5f9',borderRadius:'99px',overflow:'hidden'}}>
                <div style={{height:'100%',width:(completed.length/20*100)+'%',background:'linear-gradient(90deg,#ef4444,#ec4899)',borderRadius:'99px',transition:'width 0.6s ease'}}/>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:'6px'}}>
                {themes.map((theme,i)=>{
                  const themeLessons=LESSONS.filter(l=>l.theme===theme);
                  const doneCount=themeLessons.filter(l=>completed.includes(l.id)).length;
                  return <div key={theme} style={{fontSize:'9px',color:doneCount===themeLessons.length?'#ef4444':'#cbd5e1',fontWeight:600,textAlign:'center'}}>{doneCount}/{themeLessons.length}</div>;
                })}
              </div>
            </div>
            {/* Sam message */}
            <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'16px',padding:'14px 16px',marginBottom:'16px',display:'flex',gap:'10px',alignItems:'center'}}>
              <div style={{fontSize:'26px',flexShrink:0}}>🎙️</div>
              <div>
                <div style={{color:'#ef4444',fontSize:'10px',fontWeight:700,marginBottom:'2px'}}>PROF SAM</div>
                <div style={{color:'#64748b',fontSize:'12px',lineHeight:1.5}}>
                  {completed.length===0?'Hey '+user.name+'! Ready for lesson 1? Lets GO!':
                   completed.length<10?'Great progress '+user.name+'! Keep it up!':
                   completed.length<20?user.name+', you are halfway! Im proud of you!':
                   'LEGENDARY '+user.name+'! You completed ALL 20 lessons!'}
                </div>
              </div>
            </div>
            {/* Lessons by theme */}
            {themes.map(theme=>{
              const themeLessons=LESSONS.filter(l=>l.theme===theme);
              const firstLesson=themeLessons[0];
              return(
                <div key={theme} style={{marginBottom:'20px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px'}}>
                    <div style={{width:'28px',height:'28px',borderRadius:'8px',background:firstLesson.color+'15',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px'}}>{firstLesson.emoji}</div>
                    <span style={{fontWeight:800,fontSize:'14px',color:'#111'}}>{theme}</span>
                    <span style={{fontSize:'11px',color:'#cbd5e1',marginLeft:'auto'}}>
                      {themeLessons.filter(l=>completed.includes(l.id)).length}/{themeLessons.length}
                    </span>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                    {themeLessons.map((lesson,i)=>{
                      const done=completed.includes(lesson.id);
                      const prevDone=lesson.id===1||completed.includes(lesson.id-1);
                      const locked=!prevDone&&!done;
                      return(
                        <button key={lesson.id} onClick={()=>!locked&&onSelect(lesson)}
                          style={{background:locked?'#f8fafc':'#fff',border:done?'2px solid '+lesson.color:'2px solid #e2e8f0',borderRadius:'18px',padding:'13px 16px',display:'flex',alignItems:'center',gap:'12px',cursor:locked?'not-allowed':'pointer',opacity:locked?0.45:1,textAlign:'left',boxShadow:done?'0 4px 16px '+lesson.color+'20':'0 2px 6px rgba(0,0,0,0.04)',transition:'all 0.2s'}}>
                          <div style={{width:'46px',height:'46px',borderRadius:'13px',background:locked?'#f1f5f9':lesson.color+'15',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',flexShrink:0,position:'relative'}}>
                            {lesson.emoji}
                            {done&&<div style={{position:'absolute',bottom:'-3px',right:'-3px',background:lesson.color,borderRadius:'50%',width:'16px',height:'16px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',color:'#fff'}}>✓</div>}
                          </div>
                          <div style={{flex:1}}>
                            <div style={{fontWeight:800,fontSize:'14px',color:'#111'}}>{locked?'🔒 ':lesson.id+'. '}{lesson.title}</div>
                            <div style={{display:'flex',gap:'6px',marginTop:'3px'}}>
                              <span style={{background:lesson.color+'15',color:lesson.color,fontSize:'10px',fontWeight:700,borderRadius:'6px',padding:'1px 6px'}}>+{lesson.xp} XP</span>
                              <span style={{color:'#cbd5e1',fontSize:'10px'}}>5 phrases · 5 exercices</span>
                            </div>
                          </div>
                          {!locked&&<div style={{color:lesson.color,fontSize:'13px'}}>→</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div style={{height:'20px'}}/>
          </div>
        )}

        {tab==='badges'&&(
          <div style={{padding:'16px'}}>
            <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'16px',padding:'14px 16px',marginBottom:'16px',display:'flex',gap:'10px'}}>
              <div style={{fontSize:'24px'}}>🎙️</div>
              <div>
                <div style={{color:'#ef4444',fontSize:'10px',fontWeight:700,marginBottom:'2px'}}>PROF SAM</div>
                <div style={{color:'#64748b',fontSize:'12px'}}>"{earnedBadges.length} badges gagnes sur 12. {user.name}, you're doing amazing!"</div>
              </div>
            </div>
            <div style={{fontWeight:800,fontSize:'16px',color:'#111',marginBottom:'12px'}}>Tes Badges 🏆</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              {ALL_BADGES.map(badge=>{
                const earned=earnedBadges.includes(badge.id);
                return(
                  <div key={badge.id} style={{background:earned?'#fff':'#f8fafc',border:earned?'2px solid '+badge.color:'2px solid #f1f5f9',borderRadius:'18px',padding:'16px',textAlign:'center',opacity:earned?1:0.5,boxShadow:earned?'0 4px 14px '+badge.color+'20':'none',transition:'all 0.3s'}}>
                    <div style={{fontSize:'32px',marginBottom:'6px',filter:earned?'none':'grayscale(1)'}}>{badge.emoji}</div>
                    <div style={{fontWeight:800,fontSize:'13px',color:earned?'#111':'#94a3b8'}}>{badge.label}</div>
                    <div style={{fontSize:'11px',color:earned?badge.color:'#cbd5e1',marginTop:'3px',lineHeight:1.4}}>{badge.desc}</div>
                    {earned&&<div style={{marginTop:'6px',fontSize:'10px',background:badge.color+'15',color:badge.color,borderRadius:'6px',padding:'2px 8px',display:'inline-block',fontWeight:700}}>DEBLOQUE !</div>}
                  </div>
                );
              })}
            </div>
            <div style={{height:'20px'}}/>
          </div>
        )}

        {tab==='rank'&&(
          <div style={{padding:'16px'}}>
            <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'16px',padding:'14px 16px',marginBottom:'16px',display:'flex',gap:'10px'}}>
              <div style={{fontSize:'24px'}}>🎙️</div>
              <div>
                <div style={{color:'#ef4444',fontSize:'10px',fontWeight:700,marginBottom:'2px'}}>PROF SAM</div>
                <div style={{color:'#64748b',fontSize:'12px'}}>"Competition is healthy! Push yourself to the top, {user.name}!"</div>
              </div>
            </div>
            <div style={{fontWeight:800,fontSize:'16px',color:'#111',marginBottom:'12px'}}>Classement Beta 👑</div>
            {/* User position */}
            <div style={{background:'linear-gradient(135deg,#ef444415,#ec489910)',border:'2px solid #ef4444',borderRadius:'18px',padding:'14px 16px',marginBottom:'12px',display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'linear-gradient(135deg,#ef4444,#ec4899)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:'14px',flexShrink:0}}>★</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:'14px',color:'#111'}}>{user.name} — Toi</div>
                <div style={{fontSize:'12px',color:'#ef4444',fontWeight:600}}>{user.xp} XP · {completed.length} lecons</div>
              </div>
              <div style={{fontWeight:900,fontSize:'18px',color:'#ef4444'}}>#{Math.max(1,MOCK_FRIENDS.filter(f=>f.xp>user.xp).length+1)}</div>
            </div>
            {/* Friends */}
            {[...MOCK_FRIENDS,{name:user.name,xp:user.xp,streak:user.streak,flag:'YOU',isUser:true}]
              .sort((a,b)=>b.xp-a.xp)
              .map((friend,i)=>{
                if(friend.isUser)return null;
                const medals=['🥇','🥈','🥉'];
                return(
                  <div key={friend.name} style={{background:'#fff',border:'2px solid #f1f5f9',borderRadius:'16px',padding:'12px 16px',marginBottom:'8px',display:'flex',alignItems:'center',gap:'12px',boxShadow:'0 2px 6px rgba(0,0,0,0.04)'}}>
                    <div style={{width:'32px',textAlign:'center',fontSize:'20px',flexShrink:0}}>{i<3?medals[i]:i+1}</div>
                    <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'#f1f5f9',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',fontWeight:800,color:'#64748b',flexShrink:0}}>{friend.name[0]}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800,fontSize:'13px',color:'#111'}}>{friend.name}</div>
                      <div style={{fontSize:'11px',color:'#94a3b8'}}>{friend.xp} XP · 🔥 {friend.streak}j</div>
                    </div>
                    <div style={{fontSize:'11px',color:'#cbd5e1',fontWeight:600}}>{friend.flag}</div>
                  </div>
                );
              })}
            <div style={{height:'20px'}}/>
          </div>
        )}

        {tab==='culture'&&(
          <div style={{padding:'16px'}}>
            <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'16px',padding:'14px 16px',marginBottom:'16px',display:'flex',gap:'10px'}}>
              <div style={{fontSize:'24px'}}>🎙️</div>
              <div>
                <div style={{color:'#ef4444',fontSize:'10px',fontWeight:700,marginBottom:'2px'}}>PROF SAM</div>
                <div style={{color:'#64748b',fontSize:'12px'}}>"To truly speak American, you need to know American culture. Here are the essentials!"</div>
              </div>
            </div>
            <div style={{fontWeight:800,fontSize:'16px',color:'#111',marginBottom:'12px'}}>Culture Americaine 🗽</div>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {CULTURE_FACTS.map((fact,i)=>(
                <div key={i} style={{background:'#fff',border:'2px solid #f1f5f9',borderRadius:'20px',padding:'18px',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
                    <div style={{fontSize:'32px'}}>{fact.emoji}</div>
                    <div style={{fontWeight:800,fontSize:'15px',color:'#111'}}>{fact.title}</div>
                  </div>
                  <div style={{fontSize:'13px',color:'#64748b',lineHeight:1.6}}>{fact.text}</div>
                </div>
              ))}
            </div>
            <div style={{height:'20px'}}/>
          </div>
        )}
      </div>
    </div>
  );
}


// LESSON MENU
function LessonMenu({lesson,user,onMode,onBack}){
  const [played,setPlayed]=useState(false);
  return(
    <div style={{padding:'24px 16px',background:'#f8fafc',minHeight:'100vh'}}>
      <BackBtn onClick={onBack}/>
      <div style={{textAlign:'center',margin:'18px 0 22px'}}>
        <div style={{width:'76px',height:'76px',borderRadius:'22px',background:lesson.color+'15',fontSize:'36px',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}>{lesson.emoji}</div>
        <div style={{fontSize:'11px',color:'#94a3b8',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',marginBottom:'4px'}}>{lesson.theme}</div>
        <h2 style={{margin:0,fontSize:'22px',fontWeight:900}}>Lecon {lesson.id} — {lesson.title}</h2>
        <div style={{display:'inline-block',marginTop:'7px',background:lesson.color+'15',color:lesson.color,borderRadius:'8px',padding:'3px 12px',fontSize:'12px',fontWeight:700}}>+{lesson.xp} XP</div>
      </div>
      <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'20px',padding:'18px',marginBottom:'18px'}}>
        <div style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
          <div style={{fontSize:'32px',flexShrink:0}}>🎙️</div>
          <div style={{flex:1}}>
            <div style={{color:'#ef4444',fontSize:'11px',fontWeight:700,letterSpacing:'1px',marginBottom:'7px'}}>PROF SAM</div>
            <div style={{color:'#94a3b8',fontSize:'13px',lineHeight:1.6,fontStyle:'italic'}}>"{lesson.samSays}"</div>
            <button onClick={()=>{setPlayed(true);speak(lesson.samSays,0.88);}}
              style={{marginTop:'10px',background:played?'rgba(239,68,68,0.15)':'rgba(239,68,68,0.1)',color:'#ef4444',border:'1px solid rgba(239,68,68,0.25)',borderRadius:'10px',padding:'7px 14px',fontSize:'12px',fontWeight:700,cursor:'pointer'}}>
              {played?'🔊 Reecouter Sam':'🔊 Ecouter Sam parler'}
            </button>
          </div>
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
        {[
          {key:'learn',    emoji:'🎭', label:'Apprendre avec Sam',    desc:"Decouvre les phrases avec leur contexte americain"},
          {key:'mirror',   emoji:'🎙️', label:'Repete apres Sam',      desc:"Tu parles, Sam corrige ton accent", hot:true},
          {key:'exercises',emoji:'✏️', label:'Exercices',             desc:"3 types : remplir, traduire, choix multiple", hot:true},
          {key:'quiz',     emoji:'🎯', label:'Quiz — Gagne tes XP',   desc:"Valide la lecon et debloque la suivante"},
        ].map(m=>(
          <button key={m.key} onClick={()=>onMode(m.key)}
            style={{background:m.hot?lesson.color+'08':'#fff',border:m.hot?'2px solid '+lesson.color:'2px solid #e2e8f0',borderRadius:'16px',padding:'14px 16px',display:'flex',alignItems:'center',gap:'12px',cursor:'pointer',textAlign:'left',boxShadow:m.hot?'0 4px 14px '+lesson.color+'18':'0 2px 6px rgba(0,0,0,0.04)'}}>
            <div style={{width:'44px',height:'44px',borderRadius:'12px',background:lesson.color+'12',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',flexShrink:0}}>{m.emoji}</div>
            <div>
              <div style={{fontWeight:800,fontSize:'14px',color:'#111'}}>{m.label}</div>
              <div style={{color:'#94a3b8',fontSize:'11px',marginTop:'1px'}}>{m.desc}</div>
            </div>
            <div style={{marginLeft:'auto',color:'#e2e8f0'}}>→</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// LEARN MODE
function LearnMode({lesson,user,onBack}){
  const [wi,setWi]=useState(0);
  const [revealed,setRevealed]=useState(false);
  const [spk,setSpk]=useState(false);
  const word=lesson.words[wi];
  const speed=user.level.speed;
  const reps=user.level.reps;
  useEffect(()=>setRevealed(false),[wi]);

  const listenSam=()=>{
    setSpk(true);
    let c=0;
    const next=()=>{c++;speak(word.en,speed,()=>{if(c<reps)setTimeout(next,500);else setSpk(false);});};
    next();
  };

  return(
    <div style={{padding:'24px 16px',background:'#f8fafc',minHeight:'100vh'}}>
      <BackBtn onClick={onBack}/>
      <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'14px',padding:'12px 14px',margin:'14px 0',display:'flex',gap:'10px',alignItems:'center'}}>
        <div style={{fontSize:'22px'}}>🎙️</div>
        <div style={{color:'#64748b',fontSize:'12px'}}>
          <span style={{color:'#ef4444',fontWeight:700}}>Sam : </span>
          <span style={{fontStyle:'italic'}}>Phrase {wi+1}/{lesson.words.length}. Listen then repeat!</span>
        </div>
      </div>
      <div style={{fontSize:'11px',color:'#94a3b8',textAlign:'center',marginBottom:'10px'}}>Phrase {wi+1} / {lesson.words.length}</div>
      <div style={{background:'#fff',borderRadius:'20px',padding:'22px 20px',border:'2px solid #f1f5f9',marginBottom:'14px',boxShadow:'0 4px 16px rgba(0,0,0,0.05)'}}>
        <div style={{fontSize:'10px',color:'#cbd5e1',marginBottom:'4px',fontWeight:700,letterSpacing:'1px'}}>FRANCAIS</div>
        <div style={{fontSize:'22px',fontWeight:900,color:'#111',marginBottom:'16px'}}>{word.fr}</div>
        {!revealed?(
          <button onClick={()=>setRevealed(true)} style={{width:'100%',background:'#f8fafc',border:'none',borderRadius:'12px',padding:'14px',fontSize:'14px',color:'#94a3b8',cursor:'pointer',fontWeight:700}}>
            Voir la traduction de Sam →
          </button>
        ):(
          <>
            <div style={{fontSize:'10px',color:'#cbd5e1',marginBottom:'4px',fontWeight:700,letterSpacing:'1px'}}>SAM DIT...</div>
            <div style={{fontSize:'24px',fontWeight:900,color:'#111',marginBottom:'4px'}}>{word.en}</div>
            <div style={{fontSize:'15px',color:lesson.color,marginBottom:'10px',fontStyle:'italic'}}>[{word.ph}]</div>
            <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'10px',padding:'10px 12px',marginBottom:'12px'}}>
              <div style={{fontSize:'10px',color:'#92400e',fontWeight:700,marginBottom:'2px',letterSpacing:'1px'}}>SAM EXPLIQUE</div>
              <div style={{fontSize:'12px',color:'#78350f',lineHeight:1.5}}>{word.tip}</div>
            </div>
            <button onClick={listenSam} style={{width:'100%',background:spk?lesson.color:'#111',color:'#fff',border:'none',borderRadius:'12px',padding:'13px',fontSize:'14px',fontWeight:800,cursor:'pointer',transition:'background 0.2s'}}>
              {spk?'🔊 Sam parle...':'🔊 Ecouter Sam x'+reps}
            </button>
          </>
        )}
      </div>
      <div style={{display:'flex',gap:'10px'}}>
        <button onClick={()=>wi>0&&setWi(wi-1)} disabled={wi===0} style={{...NB,opacity:wi===0?0.3:1}}>← Prec</button>
        <button onClick={()=>wi<lesson.words.length-1&&setWi(wi+1)} disabled={wi===lesson.words.length-1} style={{...NB,flex:2,background:lesson.color,color:'#fff',opacity:wi===lesson.words.length-1?0.3:1}}>Suivant →</button>
      </div>
    </div>
  );
}

// MIRROR MODE
function MirrorMode({lesson,user,onBack}){
  const speed=user.level.speed;
  const reps=user.level.reps;
  const [wi,setWi]=useState(0);
  const [phase,setPhase]=useState('ready');
  const [result,setResult]=useState(null);
  const [attempts,setAttempts]=useState(0);
  const [passed,setPassed]=useState([]);
  const [transcript,setTranscript]=useState('');
  const recRef=useRef(null);
  const word=lesson.words[wi];
  useEffect(()=>{setPhase('ready');setResult(null);setTranscript('');},[wi]);

  const listenSam=()=>{
    setPhase('speaking');
    let c=0;
    const next=()=>{c++;speak(word.en,speed,()=>{if(c<reps)setTimeout(next,500);else setPhase('ready');});};
    next();
  };

  const startRec=()=>{
    if(phase==='speaking'||phase==='listening')return;
    setPhase('listening');setTranscript('');
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
        const tw=word.en.toLowerCase().replace(/[^a-z\s]/g,'').split(' ').filter(Boolean);
        const sw=said.replace(/[^a-z\s]/g,'').split(' ').filter(Boolean);
        const m=tw.filter(t=>sw.some(s=>s.includes(t.slice(0,3))||t.includes(s.slice(0,3))));
        doResult(said,m.length/Math.max(tw.length,1)>=0.45);
      };
      r.onerror=(e)=>{got=true;setPhase(e.error==='not-allowed'?'manual':'ready');};
      r.onend=()=>{if(!got)setPhase(p=>p==='listening'?'manual':p);};
      r.start();
    }catch(e){setPhase('manual');}
  };

  const doResult=(said,ok)=>{
    if(recRef.current){try{recRef.current.stop();}catch(_){}}
    setTranscript(said);setResult(ok?'ok':'fail');setPhase('result');tone(ok);
  };

  const handleNext=()=>{
    if(result==='ok'){
      setPassed(p=>[...p,wi]);
      if(wi+1>=lesson.words.length)setPhase('done');
      else{setWi(wi+1);setAttempts(0);}
    }else{setAttempts(a=>a+1);setResult(null);setTranscript('');setPhase('ready');}
  };

  if(phase==='done')return(
    <div style={{padding:'40px 20px',display:'flex',flexDirection:'column',alignItems:'center',gap:'16px',textAlign:'center',background:'#f8fafc',minHeight:'100vh'}}>
      <div style={{fontSize:'70px'}}>🎙️</div>
      <div style={{fontSize:'24px',fontWeight:900}}>Sam est fier de toi !</div>
      <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'18px',padding:'16px 20px',maxWidth:'300px',width:'100%'}}>
        <div style={{color:'#ef4444',fontSize:'11px',fontWeight:700,marginBottom:'6px'}}>PROF SAM</div>
        <div style={{color:'#94a3b8',fontSize:'13px',fontStyle:'italic'}}>"{passed.length}/{lesson.words.length} phrases reussies. {user.name}, you're becoming a real American speaker!"</div>
      </div>
      <button onClick={onBack} style={{background:lesson.color,color:'#fff',border:'none',borderRadius:'14px',padding:'15px 32px',fontSize:'15px',fontWeight:800,cursor:'pointer'}}>Retour 🏠</button>
    </div>
  );

  return(
    <div style={{padding:'24px 16px',background:'#f8fafc',minHeight:'100vh'}}>
      <BackBtn onClick={onBack}/>
      <div style={{textAlign:'center',margin:'10px 0 12px'}}>
        <div style={{fontSize:'11px',color:'#94a3b8',marginBottom:'5px'}}>Phrase {wi+1} / {lesson.words.length}</div>
        <div style={{height:'5px',background:'#e2e8f0',borderRadius:'99px'}}>
          <div style={{height:'100%',width:(wi/lesson.words.length*100)+'%',background:lesson.color,borderRadius:'99px',transition:'width 0.4s'}}/>
        </div>
      </div>
      <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'20px',padding:'20px',textAlign:'center',marginBottom:'14px'}}>
        <div style={{fontSize:'10px',color:'#475569',marginBottom:'6px',letterSpacing:'1px'}}>DIS CETTE PHRASE EN AMERICAIN</div>
        <div style={{fontSize:'20px',fontWeight:900,color:'#fff',marginBottom:'8px'}}>{word.fr}</div>
        <div style={{fontSize:'17px',color:lesson.color,fontWeight:700,marginBottom:'2px'}}>{word.en}</div>
        <div style={{fontSize:'12px',color:'#475569',fontStyle:'italic'}}>[{word.ph}]</div>
      </div>
      {phase==='result'&&(
        <div style={{marginBottom:'12px'}}>
          <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'14px',padding:'12px 16px',marginBottom:'10px',display:'flex',gap:'10px'}}>
            <div style={{fontSize:'22px'}}>🎙️</div>
            <div>
              <div style={{color:'#ef4444',fontSize:'10px',fontWeight:700,marginBottom:'2px'}}>SAM DIT :</div>
              <div style={{color:result==='ok'?'#10b981':'#f59e0b',fontSize:'13px',fontWeight:700}}>{result==='ok'?rand(SAM_WIN):rand(SAM_TRY)}</div>
              {transcript?<div style={{color:'#475569',fontSize:'11px',marginTop:'2px'}}>Tu as dit : "{transcript}"</div>:null}
            </div>
          </div>
          <div style={{background:result==='ok'?'#10b98112':'#f59e0b12',border:'2px solid '+(result==='ok'?'#10b981':'#f59e0b'),borderRadius:'14px',padding:'14px',textAlign:'center',marginBottom:'10px'}}>
            <div style={{fontSize:'38px',marginBottom:'4px'}}>{result==='ok'?'✅':'🔄'}</div>
            <div style={{fontWeight:800,fontSize:'16px',color:result==='ok'?'#10b981':'#f59e0b'}}>{result==='ok'?'Parfait !':'Presque ! Reessaie 💪'}</div>
          </div>
          <button onClick={handleNext} style={{width:'100%',background:result==='ok'?'#10b981':lesson.color,color:'#fff',border:'none',borderRadius:'13px',padding:'14px',fontSize:'15px',fontWeight:800,cursor:'pointer'}}>
            {result==='ok'?(wi+1>=lesson.words.length?'Terminer 🏁':'Phrase suivante →'):'Reessayer 🔄'}
          </button>
        </div>
      )}
      {phase==='listening'&&(
        <div style={{textAlign:'center',padding:'20px',background:lesson.color+'10',borderRadius:'18px',border:'2px solid '+lesson.color,marginBottom:'12px'}}>
          <div style={{fontSize:'36px',marginBottom:'6px'}}>👂</div>
          <div style={{fontWeight:800,fontSize:'15px',color:'#111',marginBottom:'6px'}}>Sam t'ecoute...</div>
          <div style={{display:'flex',justifyContent:'center',gap:'5px'}}>
            {[0,1,2,3].map(i=><div key={i} style={{width:'5px',height:'22px',background:lesson.color,borderRadius:'99px',animation:'bounce 0.7s '+(i*0.12)+'s infinite alternate'}}/>)}
          </div>
        </div>
      )}
      {phase==='speaking'&&(
        <div style={{textAlign:'center',padding:'16px',background:'#f1f5f9',borderRadius:'16px',marginBottom:'12px'}}>
          <div style={{fontSize:'28px'}}>🔊</div>
          <div style={{fontWeight:700,fontSize:'13px',color:'#111',marginTop:'4px'}}>Sam parle ({reps}x)...</div>
        </div>
      )}
      {phase==='ready'&&result===null&&(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'12px'}}>
          {attempts>0&&(
            <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'12px',padding:'10px 14px',textAlign:'center',width:'100%'}}>
              <div style={{color:'#ef4444',fontSize:'10px',fontWeight:700,marginBottom:'2px'}}>SAM :</div>
              <div style={{color:'#94a3b8',fontSize:'12px',fontStyle:'italic'}}>"Don't give up! Try: {word.en}"</div>
            </div>
          )}
          <button onClick={startRec} style={{width:'92px',height:'92px',borderRadius:'50%',background:'linear-gradient(135deg,'+lesson.color+',#ec4899)',border:'none',cursor:'pointer',fontSize:'36px',boxShadow:'0 10px 30px '+lesson.color+'50',display:'flex',alignItems:'center',justifyContent:'center'}}>
            🎙️
          </button>
          <div style={{fontWeight:800,fontSize:'15px',color:'#111'}}>Appuie et parle !</div>
          <div style={{fontSize:'12px',color:'#94a3b8'}}>Dis : "{word.en}"</div>
          <button onClick={listenSam} style={{background:'none',border:'1.5px solid '+lesson.color,borderRadius:'11px',padding:'7px 18px',fontSize:'12px',color:lesson.color,cursor:'pointer',fontWeight:700}}>
            🔊 Ecouter x{reps}
          </button>
        </div>
      )}
      {phase==='manual'&&(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'10px'}}>
          <div style={{background:'#fffbeb',border:'2px solid #fde68a',borderRadius:'14px',padding:'14px 16px',width:'100%',textAlign:'center'}}>
            <div style={{fontWeight:800,fontSize:'12px',color:'#92400e'}}>Micro non disponible</div>
            <div style={{fontSize:'11px',color:'#78350f',marginTop:'2px',lineHeight:1.4}}>Ouvre dans Safari sur iPhone.<br/>Pratique a voix haute en attendant !</div>
          </div>
          <div style={{fontWeight:700,fontSize:'15px',textAlign:'center'}}>Prononce : <span style={{color:lesson.color}}>"{word.en}"</span></div>
          <button onClick={listenSam} style={{background:'none',border:'1.5px solid '+lesson.color,borderRadius:'11px',padding:'7px 18px',fontSize:'12px',color:lesson.color,cursor:'pointer',fontWeight:700}}>🔊 Ecouter Sam</button>
          <div style={{display:'flex',gap:'10px',width:'100%'}}>
            <button onClick={()=>doResult('',false)} style={{flex:1,background:'#f1f5f9',border:'none',borderRadius:'12px',padding:'12px',fontSize:'13px',fontWeight:700,cursor:'pointer',color:'#64748b'}}>😅 Pas encore</button>
            <button onClick={()=>doResult(word.en,true)} style={{flex:1,background:lesson.color,border:'none',borderRadius:'12px',padding:'12px',fontSize:'13px',fontWeight:800,cursor:'pointer',color:'#fff'}}>✅ J'ai reussi !</button>
          </div>
        </div>
      )}
      <style>{'@keyframes bounce{from{transform:scaleY(0.4)}to{transform:scaleY(1.7)}}'}</style>
    </div>
  );
}


// EXERCISES MODE
function ExercisesMode({lesson,user,onBack}){
  const [ei,setEi]=useState(0);
  const [input,setInput]=useState('');
  const [chosen,setChosen]=useState(null);
  const [checked,setChecked]=useState(false);
  const [correct,setCorrect]=useState(false);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const ex=lesson.exercises[ei];
  const reset=()=>{setInput('');setChosen(null);setChecked(false);setCorrect(false);};

  const check=()=>{
    const ans=ex.type==='choice'?chosen:input.trim().toLowerCase();
    const ok=ans===ex.a.toLowerCase()||ans?.replace(/[!?,.']/g,'')===ex.a.toLowerCase().replace(/[!?,.']/g,'');
    setCorrect(ok);setChecked(true);tone(ok);
    if(ok)setScore(s=>s+1);
  };

  const next=()=>{
    if(ei+1>=lesson.exercises.length)setDone(true);
    else{setEi(ei+1);reset();}
  };

  if(done){
    const pct=Math.round(score/lesson.exercises.length*100);
    return(
      <div style={{padding:'32px 20px',display:'flex',flexDirection:'column',alignItems:'center',gap:'14px',textAlign:'center',background:'#f8fafc',minHeight:'100vh'}}>
        <div style={{fontSize:'62px'}}>{pct===100?'🏆':pct>=80?'🌟':pct>=60?'👍':'💪'}</div>
        <div style={{fontSize:'26px',fontWeight:900}}>{score}/{lesson.exercises.length}</div>
        <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'18px',padding:'16px 20px',maxWidth:'300px',width:'100%'}}>
          <div style={{color:'#ef4444',fontSize:'11px',fontWeight:700,marginBottom:'6px'}}>PROF SAM</div>
          <div style={{color:'#94a3b8',fontSize:'13px',fontStyle:'italic'}}>
            {pct===100?'"PERFECT '+user.name+'! 100%! You\'re on fire!"':
             pct>=60?'"Well done '+user.name+'! Now do the quiz to unlock the next lesson!"':
             '"Keep going '+user.name+'! Practice makes perfect!"'}
          </div>
        </div>
        <button onClick={onBack} style={{background:lesson.color,color:'#fff',border:'none',borderRadius:'14px',padding:'15px 32px',fontSize:'15px',fontWeight:800,cursor:'pointer'}}>Retour 🏠</button>
      </div>
    );
  }

  return(
    <div style={{padding:'24px 16px',background:'#f8fafc',minHeight:'100vh'}}>
      <BackBtn onClick={onBack}/>
      <div style={{margin:'14px 0 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px'}}>
          <span style={{fontSize:'12px',color:'#94a3b8'}}>Exercice {ei+1}/{lesson.exercises.length}</span>
          <span style={{fontSize:'12px',color:'#94a3b8'}}>✅ {score} bons</span>
        </div>
        <div style={{height:'5px',background:'#e2e8f0',borderRadius:'99px'}}>
          <div style={{height:'100%',width:(ei/lesson.exercises.length*100)+'%',background:lesson.color,borderRadius:'99px',transition:'width 0.3s'}}/>
        </div>
      </div>
      <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'16px',padding:'14px 16px',marginBottom:'16px',display:'flex',gap:'10px'}}>
        <div style={{fontSize:'24px'}}>🎙️</div>
        <div>
          <div style={{color:'#ef4444',fontSize:'10px',fontWeight:700,marginBottom:'2px'}}>SAM :</div>
          <div style={{color:'#94a3b8',fontSize:'13px',fontStyle:'italic'}}>"{ex.q}"</div>
        </div>
      </div>
      {ex.type==='fill'&&(
        <div style={{marginBottom:'14px'}}>
          <div style={{background:'#f1f5f9',borderRadius:'14px',padding:'18px',textAlign:'center',marginBottom:'10px'}}>
            <div style={{fontSize:'18px',fontWeight:800,color:'#111',lineHeight:1.6}}>
              {ex.q.split('___').map((part,i,arr)=>(
                <span key={i}>{part}{i<arr.length-1&&(
                  <span style={{borderBottom:'3px solid '+lesson.color,padding:'2px 8px',color:checked?(correct?'#10b981':'#ef4444'):'#111',fontStyle:checked?'normal':'italic'}}>
                    {checked?(correct?input||ex.a:input||'___'):(input||'___')}
                  </span>
                )}</span>
              ))}
            </div>
            <div style={{fontSize:'11px',color:'#cbd5e1',marginTop:'6px'}}>Phonetique : [{ex.hint}]</div>
          </div>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!checked&&check()}
            placeholder={'Tape ta reponse... ['+ex.hint+']'} disabled={checked}
            style={{width:'100%',padding:'13px 16px',fontSize:'16px',fontWeight:700,borderRadius:'13px',border:'2px solid '+(checked?(correct?'#10b981':'#ef4444'):'#e2e8f0'),outline:'none',textAlign:'center',color:'#111',boxSizing:'border-box',marginBottom:'10px'}}/>
        </div>
      )}
      {ex.type==='trans'&&(
        <div style={{marginBottom:'14px'}}>
          <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'14px',padding:'18px',textAlign:'center',marginBottom:'10px'}}>
            <div style={{fontSize:'11px',color:'#475569',marginBottom:'6px',letterSpacing:'1px'}}>TRADUIS EN AMERICAIN</div>
            <div style={{fontSize:'20px',fontWeight:900,color:'#fff'}}>{ex.q}</div>
            <div style={{fontSize:'11px',color:'#334155',marginTop:'4px'}}>[{ex.hint}]</div>
          </div>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!checked&&check()}
            placeholder={'Ta traduction... ['+ex.hint+']'} disabled={checked}
            style={{width:'100%',padding:'13px 16px',fontSize:'15px',fontWeight:700,borderRadius:'13px',border:'2px solid '+(checked?(correct?'#10b981':'#ef4444'):'#e2e8f0'),outline:'none',textAlign:'center',color:'#111',boxSizing:'border-box',marginBottom:'10px'}}/>
        </div>
      )}
      {ex.type==='choice'&&(
        <div style={{display:'flex',flexDirection:'column',gap:'9px',marginBottom:'14px'}}>
          {ex.opts.map(opt=>{
            const isA=opt===ex.a;
            const isCh=opt===chosen;
            return(
              <button key={opt} onClick={()=>!checked&&setChosen(opt)}
                style={{background:checked?(isA?'#10b981':isCh?'#ef4444':'#f1f5f9'):(isCh?'#111':'#fff'),color:checked&&(isA||isCh)?'#fff':isCh?'#fff':'#111',border:'2px solid '+(checked?(isA?'#10b981':isCh?'#ef4444':'#e2e8f0'):(isCh?'#111':'#e2e8f0')),borderRadius:'13px',padding:'13px 16px',fontSize:'14px',fontWeight:700,cursor:checked?'default':'pointer',textAlign:'center',transition:'all 0.2s'}}>
                {opt}
              </button>
            );
          })}
        </div>
      )}
      {checked&&(
        <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'13px',padding:'12px 14px',marginBottom:'10px',display:'flex',gap:'10px'}}>
          <div style={{fontSize:'20px'}}>🎙️</div>
          <div>
            <div style={{color:'#ef4444',fontSize:'10px',fontWeight:700,marginBottom:'2px'}}>SAM CORRIGE :</div>
            <div style={{color:correct?'#10b981':'#f59e0b',fontSize:'13px',fontWeight:700}}>
              {correct?'Perfect! Exactly right!':'La bonne reponse : "'+ex.a+'"'}
            </div>
          </div>
        </div>
      )}
      {!checked?(
        <button onClick={check} disabled={ex.type==='choice'?!chosen:!input.trim()}
          style={{width:'100%',background:(ex.type==='choice'?chosen:input.trim())?lesson.color:'#e2e8f0',color:(ex.type==='choice'?chosen:input.trim())?'#fff':'#94a3b8',border:'none',borderRadius:'13px',padding:'14px',fontSize:'15px',fontWeight:800,cursor:(ex.type==='choice'?chosen:input.trim())?'pointer':'not-allowed'}}>
          Valider ✓
        </button>
      ):(
        <button onClick={next} style={{width:'100%',background:correct?'#10b981':lesson.color,color:'#fff',border:'none',borderRadius:'13px',padding:'14px',fontSize:'15px',fontWeight:800,cursor:'pointer'}}>
          {ei+1>=lesson.exercises.length?'Voir mes resultats 🏁':'Exercice suivant →'}
        </button>
      )}
    </div>
  );
}

// QUIZ MODE
function QuizMode({lesson,user,onComplete,onBack}){
  const words=lesson.words;
  const [qi,setQi]=useState(0);
  const [score,setScore]=useState(0);
  const [chosen,setChosen]=useState(null);
  const [done,setDone]=useState(false);
  const word=words[qi];
  const choices=shuffle([word.en,...shuffle(words.filter(w=>w.en!==word.en)).slice(0,3).map(w=>w.en)]).slice(0,4);

  const choose=(c)=>{
    if(chosen)return;
    const ok=c===word.en;
    setChosen(c);tone(ok);
    if(ok){setScore(s=>s+1);speak(word.en,user.level.speed);}
    setTimeout(()=>{if(qi+1>=words.length)setDone(true);else{setQi(i=>i+1);setChosen(null);}},1000);
  };

  if(done){
    const pct=Math.round(score/words.length*100);
    const ok=pct>=60;
    return(
      <div style={{padding:'28px',display:'flex',flexDirection:'column',alignItems:'center',gap:'14px',textAlign:'center',background:'#f8fafc',minHeight:'100vh'}}>
        <div style={{fontSize:'64px'}}>{pct===100?'🏆':pct>=80?'🌟':ok?'👍':'💪'}</div>
        <div style={{fontSize:'26px',fontWeight:900}}>{score}/{words.length}</div>
        <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'18px',padding:'16px 20px',maxWidth:'300px',width:'100%'}}>
          <div style={{color:'#ef4444',fontSize:'11px',fontWeight:700,marginBottom:'6px'}}>PROF SAM</div>
          <div style={{color:'#94a3b8',fontSize:'13px',fontStyle:'italic'}}>
            {pct===100?'"PERFECT '+user.name+'! LEGENDARY!"':
             ok?'"Well done '+user.name+'! Lesson '+lesson.id+' done! Next one is unlocked!"':
             '"Keep going '+user.name+'! You need 60% to pass. I believe in you!"'}
          </div>
        </div>
        {ok?
          <button onClick={()=>onComplete(lesson.xp)} style={{background:lesson.color,color:'#fff',border:'none',borderRadius:'14px',padding:'15px 32px',fontSize:'15px',fontWeight:800,cursor:'pointer'}}>+{lesson.xp} XP — Lecon suivante 🚀</button>:
          <button onClick={()=>{setQi(0);setScore(0);setChosen(null);setDone(false);}} style={{background:'#111',color:'#fff',border:'none',borderRadius:'14px',padding:'15px 32px',fontSize:'15px',fontWeight:800,cursor:'pointer'}}>Reessayer avec Sam 🔄</button>
        }
        <button onClick={onBack} style={{background:'none',border:'none',color:'#94a3b8',cursor:'pointer',fontSize:'13px'}}>Retour</button>
      </div>
    );
  }

  return(
    <div style={{padding:'24px 16px',background:'#f8fafc',minHeight:'100vh'}}>
      <BackBtn onClick={onBack}/>
      <div style={{margin:'12px 0 14px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px'}}>
          <span style={{fontSize:'12px',color:'#94a3b8'}}>Quiz final</span>
          <span style={{fontSize:'12px',color:'#94a3b8'}}>{qi+1}/{words.length}</span>
        </div>
        <div style={{height:'5px',background:'#e2e8f0',borderRadius:'99px'}}>
          <div style={{height:'100%',width:(qi/words.length*100)+'%',background:lesson.color,borderRadius:'99px',transition:'width 0.3s'}}/>
        </div>
      </div>
      <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'12px',padding:'10px 14px',marginBottom:'14px',display:'flex',gap:'8px',alignItems:'center'}}>
        <div style={{fontSize:'18px'}}>🎙️</div>
        <div style={{color:'#475569',fontSize:'12px',fontStyle:'italic'}}>Sam : "Traduis cette phrase en americain !"</div>
      </div>
      <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',borderRadius:'20px',padding:'22px',textAlign:'center',marginBottom:'18px'}}>
        <div style={{fontSize:'10px',color:'#475569',marginBottom:'6px',letterSpacing:'1px'}}>TRADUIS EN AMERICAIN</div>
        <div style={{fontSize:'22px',fontWeight:900,color:'#fff'}}>{word.fr}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
        {choices.map(c=>{
          const ok=c===word.en;
          return(
            <button key={c} onClick={()=>choose(c)}
              style={{background:chosen?(ok?'#10b981':c===chosen?'#ef4444':'#f1f5f9'):'#fff',color:chosen&&(ok||c===chosen)?'#fff':'#111',border:'2px solid '+(chosen?(ok?'#10b981':c===chosen?'#ef4444':'#e2e8f0'):'#e2e8f0'),borderRadius:'14px',padding:'14px 8px',fontSize:'13px',fontWeight:700,cursor:chosen?'default':'pointer',transition:'all 0.2s',lineHeight:1.3,textAlign:'center'}}>
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// XP POPUP
function XPPopup({xp,onDone}){
  const [show,setShow]=useState(true);
  useEffect(()=>{const t=setTimeout(()=>{setShow(false);setTimeout(onDone,400);},2600);return()=>clearTimeout(t);},[]);
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,opacity:show?1:0,transition:'opacity 0.4s'}}>
      <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'28px',padding:'44px 52px',textAlign:'center',transform:show?'scale(1)':'scale(0.85)',transition:'transform 0.4s'}}>
        <div style={{fontSize:'56px'}}>⭐</div>
        <div style={{fontSize:'34px',fontWeight:900,color:'#fff',margin:'8px 0 4px'}}>+{xp} XP</div>
        <div style={{color:'#ef4444',fontSize:'14px',fontWeight:700}}>Lecon validee !</div>
        <div style={{color:'#475569',fontSize:'12px',marginTop:'4px',fontStyle:'italic'}}>Sam est fier de toi 🎙️</div>
      </div>
    </div>
  );
}

// BADGE POPUP
function BadgePopup({badge,onDone}){
  const [show,setShow]=useState(true);
  useEffect(()=>{const t=setTimeout(()=>{setShow(false);setTimeout(onDone,400);},3000);return()=>clearTimeout(t);},[]);
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:10000,opacity:show?1:0,transition:'opacity 0.4s'}}>
      <div style={{background:'linear-gradient(135deg,#080810,#0f172a)',border:'1px solid '+badge.color+'40',borderRadius:'28px',padding:'40px 48px',textAlign:'center',transform:show?'scale(1)':'scale(0.85)',transition:'transform 0.4s',maxWidth:'280px'}}>
        <div style={{fontSize:'14px',color:badge.color,fontWeight:700,letterSpacing:'2px',marginBottom:'10px'}}>NOUVEAU BADGE !</div>
        <div style={{fontSize:'60px',marginBottom:'8px'}}>{badge.emoji}</div>
        <div style={{fontSize:'20px',fontWeight:900,color:'#fff',marginBottom:'4px'}}>{badge.label}</div>
        <div style={{color:'#64748b',fontSize:'13px'}}>{badge.desc}</div>
      </div>
    </div>
  );
}

// SHARED
function BackBtn({onClick}){return <button onClick={onClick} style={{background:'none',border:'none',color:'#94a3b8',fontSize:'14px',cursor:'pointer',padding:0}}>← Retour</button>;}
const NB={flex:1,background:'#f1f5f9',border:'none',borderRadius:'13px',padding:'12px',fontSize:'13px',fontWeight:700,cursor:'pointer'};

// MAIN APP
export default function App(){
  const [screen,setScreen]=useState('access');
  const [user,setUser]=useState({name:'',age:25,level:LEVELS[0],xp:0,streak:1});
  const [completed,setCompleted]=useState([]);
  const [lesson,setLesson]=useState(null);
  const [mode,setMode]=useState(null);
  const [xpPopup,setXpPopup]=useState(null);
  const [badgePopup,setBadgePopup]=useState(null);
  const prevBadges=useRef([]);

  const handleComplete=(xp)=>{
    const newCompleted=completed.includes(lesson.id)?completed:[...completed,lesson.id];
    const newUser={...user,xp:user.xp+xp};
    setCompleted(newCompleted);
    setUser(newUser);
    setXpPopup(xp);
    setMode(null);
    // Check for new badges
    const newBadges=checkBadges(newUser,newCompleted);
    const newOnes=newBadges.filter(b=>!prevBadges.current.includes(b));
    if(newOnes.length>0){
      const badge=ALL_BADGES.find(b=>b.id===newOnes[0]);
      if(badge)setTimeout(()=>setBadgePopup(badge),2800);
    }
    prevBadges.current=newBadges;
  };

  return(
    <div style={{minHeight:'100vh',fontFamily:"-apple-system,'Segoe UI',sans-serif",maxWidth:'480px',margin:'0 auto',position:'relative'}}>
      {xpPopup&&<XPPopup xp={xpPopup} onDone={()=>setXpPopup(null)}/>}
      {badgePopup&&<BadgePopup badge={badgePopup} onDone={()=>setBadgePopup(null)}/>}
      {screen==='access'&&<Access onDone={()=>setScreen('onboard')}/>}
      {screen==='onboard'&&<Onboard onDone={u=>{setUser({...u,xp:0,streak:1});setScreen('home');}}/>}
      {screen==='home'&&!lesson&&<Home user={user} completed={completed} onSelect={l=>{setLesson(l);setMode(null);}}/>}
      {lesson&&!mode&&<LessonMenu lesson={lesson} user={user} onMode={m=>setMode(m)} onBack={()=>setLesson(null)}/>}
      {lesson&&mode==='learn'&&<LearnMode lesson={lesson} user={user} onBack={()=>setMode(null)}/>}
      {lesson&&mode==='mirror'&&<MirrorMode lesson={lesson} user={user} onBack={()=>setMode(null)}/>}
      {lesson&&mode==='exercises'&&<ExercisesMode lesson={lesson} user={user} onBack={()=>setMode(null)}/>}
      {lesson&&mode==='quiz'&&<QuizMode lesson={lesson} user={user} onComplete={handleComplete} onBack={()=>setMode(null)}/>}
    </div>
  );
}
