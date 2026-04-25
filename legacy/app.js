// ============================================
// SISTEMA DE VERSÍCULOS BÍBLICOS REFLEXIVOS
// Máximo catálogo posible - 200+ versículos curados
// ============================================

(function() {
    'use strict';
  
    // ============================================
    // ESTADO GLOBAL
    // ============================================
    let currentLang = 'es';
    let currentMood = 'all';
    let recentVerses = [];
    const MAX_RECENT = 20;
    let totalVersesGenerated = 0;
  
    // ============================================
    // CATÁLOGO DE VERSÍCULOS CURADOS (200+)
    // ============================================
    const CURATED_VERSES = {
      es: {
        comfort: [
          { text: "Jehová es mi pastor; nada me faltará.", ref: "Salmo 23:1" },
          { text: "Estad quietos, y conoced que yo soy Dios.", ref: "Salmo 46:10" },
          { text: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.", ref: "Mateo 11:28" },
          { text: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da.", ref: "Juan 14:27" },
          { text: "En el mundo tendréis aflicción; pero confiad, yo he vencido al mundo.", ref: "Juan 16:33" },
          { text: "El Señor es mi luz y mi salvación; ¿de quién temeré?", ref: "Salmo 27:1" },
          { text: "Jehová es mi fortaleza y mi escudo; en él confió mi corazón.", ref: "Salmo 28:7" },
          { text: "Aunque ande en valle de sombra de muerte, no temeré mal alguno.", ref: "Salmo 23:4" },
          { text: "Cercano está Jehová a los quebrantados de corazón.", ref: "Salmo 34:18" },
          { text: "Echad toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.", ref: "1 Pedro 5:7" },
          { text: "No se turbe vuestro corazón; creéis en Dios, creed también en mí.", ref: "Juan 14:1" },
          { text: "Bienaventurados los que lloran, porque ellos recibirán consolación.", ref: "Mateo 5:4" },
          { text: "Jehová te pastoreará siempre, y en las sequías saciará tu alma.", ref: "Isaías 58:11" },
          { text: "Como aquel a quien consuela su madre, así os consolaré yo a vosotros.", ref: "Isaías 66:13" },
          { text: "El Dios de toda consolación nos consuela en todas nuestras tribulaciones.", ref: "2 Corintios 1:3-4" }
        ],
        wisdom: [
          { text: "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia.", ref: "Proverbios 3:5" },
          { text: "El principio de la sabiduría es el temor de Jehová.", ref: "Proverbios 1:7" },
          { text: "No os afanéis por el día de mañana.", ref: "Mateo 6:34" },
          { text: "Bienaventurados los de limpio corazón, porque ellos verán a Dios.", ref: "Mateo 5:8" },
          { text: "Sobre toda cosa guardada, guarda tu corazón; porque de él mana la vida.", ref: "Proverbios 4:23" },
          { text: "El corazón del entendido adquiere sabiduría; y el oído de los sabios busca la ciencia.", ref: "Proverbios 18:15" },
          { text: "La blanda respuesta quita la ira; mas la palabra áspera hace subir el furor.", ref: "Proverbios 15:1" },
          { text: "Todo tiene su tiempo, y todo lo que se quiere debajo del cielo tiene su hora.", ref: "Eclesiastés 3:1" },
          { text: "Mejor es la ciencia que la fuerza preciosa.", ref: "Eclesiastés 9:16" },
          { text: "Enséñanos de tal modo a contar nuestros días, que traigamos al corazón sabiduría.", ref: "Salmo 90:12" },
          { text: "La exposición de tus palabras alumbra; hace entender a los simples.", ref: "Salmo 119:130" },
          { text: "El que anda con sabios, sabio será; mas el que se junta con necios será quebrantado.", ref: "Proverbios 13:20" },
          { text: "No te jactes del día de mañana; porque no sabes qué dará de sí el día.", ref: "Proverbios 27:1" },
          { text: "Como aguas profundas es el consejo en el corazón del hombre; mas el hombre entendido lo alcanzará.", ref: "Proverbios 20:5" },
          { text: "Adquiere sabiduría, adquiere inteligencia; no te olvides ni te apartes de las razones de mi boca.", ref: "Proverbios 4:5" }
        ],
        hope: [
          { text: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios.", ref: "Isaías 41:10" },
          { text: "Todo lo puedo en Cristo que me fortalece.", ref: "Filipenses 4:13" },
          { text: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz.", ref: "Jeremías 29:11" },
          { text: "Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá.", ref: "Mateo 7:7" },
          { text: "Los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas.", ref: "Isaías 40:31" },
          { text: "Esta es la confianza que tenemos en él, que si pedimos alguna cosa conforme a su voluntad, él nos oye.", ref: "1 Juan 5:14" },
          { text: "Cosas que ojo no vio, ni oído oyó, ni han subido en corazón de hombre, son las que Dios ha preparado.", ref: "1 Corintios 2:9" },
          { text: "El cumplirá el deseo de los que le temen; oirá asimismo el clamor de ellos, y los salvará.", ref: "Salmo 145:19" },
          { text: "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.", ref: "Salmo 46:1" },
          { text: "No temas, que yo te he redimido; te puse nombre, mío eres tú.", ref: "Isaías 43:1" },
          { text: "He aquí yo estoy con vosotros todos los días, hasta el fin del mundo.", ref: "Mateo 28:20" },
          { text: "Fiel es el que prometió.", ref: "Hebreos 10:23" },
          { text: "Al que cree todo le es posible.", ref: "Marcos 9:23" },
          { text: "No desfallezcamos, pues, de hacer bien; porque a su tiempo segaremos, si no desmayamos.", ref: "Gálatas 6:9" },
          { text: "Nosotros sabemos que a los que aman a Dios, todas las cosas les ayudan a bien.", ref: "Romanos 8:28" }
        ],
        love: [
          { text: "El amor es sufrido, es benigno; el amor no tiene envidia.", ref: "1 Corintios 13:4" },
          { text: "Y ahora permanecen la fe, la esperanza y el amor, estos tres; pero el mayor de ellos es el amor.", ref: "1 Corintios 13:13" },
          { text: "Amados, amémonos unos a otros; porque el amor es de Dios.", ref: "1 Juan 4:7" },
          { text: "En esto hemos conocido el amor, en que él puso su vida por nosotros.", ref: "1 Juan 3:16" },
          { text: "Un mandamiento nuevo os doy: Que os améis unos a otros.", ref: "Juan 13:34" },
          { text: "Sobre todo, vestíos de amor, que es el vínculo perfecto.", ref: "Colosenses 3:14" },
          { text: "El amor sea sin fingimiento. Aborreced lo malo, seguid lo bueno.", ref: "Romanos 12:9" },
          { text: "Amarás al Señor tu Dios con todo tu corazón, y con toda tu alma, y con toda tu mente.", ref: "Mateo 22:37" },
          { text: "Amarás a tu prójimo como a ti mismo.", ref: "Mateo 22:39" },
          { text: "De tal manera amó Dios al mundo, que ha dado a su Hijo unigénito.", ref: "Juan 3:16" },
          { text: "Nosotros le amamos a él, porque él nos amó primero.", ref: "1 Juan 4:19" },
          { text: "En esto conocerán todos que sois mis discípulos, si tuviereis amor los unos con los otros.", ref: "Juan 13:35" },
          { text: "El amor cubrirá multitud de pecados.", ref: "1 Pedro 4:8" },
          { text: "El perfecto amor echa fuera el temor.", ref: "1 Juan 4:18" },
          { text: "Andad en amor, como también Cristo nos amó.", ref: "Efesios 5:2" }
        ],
        repentance: [
          { text: "Si confesamos nuestros pecados, él es fiel y justo para perdonar nuestros pecados.", ref: "1 Juan 1:9" },
          { text: "Arrepentíos, porque el reino de los cielos se ha acercado.", ref: "Mateo 4:17" },
          { text: "Crea en mí, oh Dios, un corazón limpio, y renueva un espíritu recto dentro de mí.", ref: "Salmo 51:10" },
          { text: "Dejad al impío su camino, y el hombre inicuo sus pensamientos; y vuélvase a Jehová.", ref: "Isaías 55:7" },
          { text: "El que encubre sus pecados no prosperará; mas el que los confiesa y se aparta alcanzará misericordia.", ref: "Proverbios 28:13" },
          { text: "Lavaos y limpiaos; quitad la iniquidad de vuestras obras de delante de mis ojos.", ref: "Isaías 1:16" },
          { text: "Así que, arrepentíos y convertíos, para que sean borrados vuestros pecados.", ref: "Hechos 3:19" },
          { text: "Vuélvete, oh Israel, a Jehová tu Dios; porque por tu pecado has caído.", ref: "Oseas 14:1" },
          { text: "Escudríñame, oh Dios, y conoce mi corazón; pruébame y conoce mis pensamientos.", ref: "Salmo 139:23" },
          { text: "Venid luego, dice Jehová, y estemos a cuenta: si vuestros pecados fueren como la grana, como la nieve serán emblanquecidos.", ref: "Isaías 1:18" },
          { text: "Procurad hacer paces con Dios, y tendréis paz.", ref: "Job 22:21" },
          { text: "Bienaventurado aquel cuya transgresión ha sido perdonada, y cubierto su pecado.", ref: "Salmo 32:1" },
          { text: "Vuélvete a mí, dice Jehová de los ejércitos, y yo me volveré a vosotros.", ref: "Zacarías 1:3" },
          { text: "Os he dado tiempo para que os arrepintáis.", ref: "Apocalipsis 2:21" },
          { text: "Lávame más y más de mi maldad, y límpiame de mi pecado.", ref: "Salmo 51:2" }
        ]
      },
      en: {
        comfort: [
          { text: "The LORD is my shepherd; I shall not want.", ref: "Psalm 23:1" },
          { text: "Be still, and know that I am God.", ref: "Psalm 46:10" },
          { text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", ref: "Matthew 11:28" },
          { text: "Peace I leave with you, my peace I give unto you.", ref: "John 14:27" },
          { text: "In the world ye shall have tribulation: but be of good cheer; I have overcome the world.", ref: "John 16:33" },
          { text: "The LORD is my light and my salvation; whom shall I fear?", ref: "Psalm 27:1" },
          { text: "The LORD is my strength and my shield; my heart trusted in him.", ref: "Psalm 28:7" },
          { text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil.", ref: "Psalm 23:4" },
          { text: "The LORD is nigh unto them that are of a broken heart.", ref: "Psalm 34:18" },
          { text: "Casting all your care upon him; for he careth for you.", ref: "1 Peter 5:7" },
          { text: "Let not your heart be troubled: ye believe in God, believe also in me.", ref: "John 14:1" },
          { text: "Blessed are they that mourn: for they shall be comforted.", ref: "Matthew 5:4" },
          { text: "The LORD shall guide thee continually, and satisfy thy soul in drought.", ref: "Isaiah 58:11" },
          { text: "As one whom his mother comforteth, so will I comfort you.", ref: "Isaiah 66:13" },
          { text: "The God of all comfort; who comforteth us in all our tribulation.", ref: "2 Corinthians 1:3-4" }
        ],
        wisdom: [
          { text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.", ref: "Proverbs 3:5" },
          { text: "The fear of the LORD is the beginning of wisdom.", ref: "Proverbs 1:7" },
          { text: "Take therefore no thought for the morrow.", ref: "Matthew 6:34" },
          { text: "Blessed are the pure in heart: for they shall see God.", ref: "Matthew 5:8" },
          { text: "Keep thy heart with all diligence; for out of it are the issues of life.", ref: "Proverbs 4:23" },
          { text: "The heart of the prudent getteth knowledge; and the ear of the wise seeketh knowledge.", ref: "Proverbs 18:15" },
          { text: "A soft answer turneth away wrath: but grievous words stir up anger.", ref: "Proverbs 15:1" },
          { text: "To every thing there is a season, and a time to every purpose under the heaven.", ref: "Ecclesiastes 3:1" },
          { text: "Wisdom is better than strength.", ref: "Ecclesiastes 9:16" },
          { text: "So teach us to number our days, that we may apply our hearts unto wisdom.", ref: "Psalm 90:12" },
          { text: "The entrance of thy words giveth light; it giveth understanding unto the simple.", ref: "Psalm 119:130" },
          { text: "He that walketh with wise men shall be wise.", ref: "Proverbs 13:20" },
          { text: "Boast not thyself of to morrow; for thou knowest not what a day may bring forth.", ref: "Proverbs 27:1" },
          { text: "Counsel in the heart of man is like deep water; but a man of understanding will draw it out.", ref: "Proverbs 20:5" },
          { text: "Get wisdom, get understanding: forget it not.", ref: "Proverbs 4:5" }
        ],
        hope: [
          { text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God.", ref: "Isaiah 41:10" },
          { text: "I can do all things through Christ which strengtheneth me.", ref: "Philippians 4:13" },
          { text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace.", ref: "Jeremiah 29:11" },
          { text: "Ask, and it shall be given you; seek, and ye shall find.", ref: "Matthew 7:7" },
          { text: "They that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles.", ref: "Isaiah 40:31" },
          { text: "This is the confidence that we have in him, that, if we ask any thing according to his will, he heareth us.", ref: "1 John 5:14" },
          { text: "Eye hath not seen, nor ear heard, neither have entered into the heart of man, the things which God hath prepared.", ref: "1 Corinthians 2:9" },
          { text: "He will fulfil the desire of them that fear him: he also will hear their cry, and will save them.", ref: "Psalm 145:19" },
          { text: "God is our refuge and strength, a very present help in trouble.", ref: "Psalm 46:1" },
          { text: "Fear not: for I have redeemed thee, I have called thee by thy name; thou art mine.", ref: "Isaiah 43:1" },
          { text: "Lo, I am with you alway, even unto the end of the world.", ref: "Matthew 28:20" },
          { text: "He is faithful that promised.", ref: "Hebrews 10:23" },
          { text: "All things are possible to him that believeth.", ref: "Mark 9:23" },
          { text: "Let us not be weary in well doing: for in due season we shall reap, if we faint not.", ref: "Galatians 6:9" },
          { text: "We know that all things work together for good to them that love God.", ref: "Romans 8:28" }
        ],
        love: [
          { text: "Charity suffereth long, and is kind; charity envieth not.", ref: "1 Corinthians 13:4" },
          { text: "And now abideth faith, hope, charity, these three; but the greatest of these is charity.", ref: "1 Corinthians 13:13" },
          { text: "Beloved, let us love one another: for love is of God.", ref: "1 John 4:7" },
          { text: "Hereby perceive we the love of God, because he laid down his life for us.", ref: "1 John 3:16" },
          { text: "A new commandment I give unto you, That ye love one another.", ref: "John 13:34" },
          { text: "Above all these things put on charity, which is the bond of perfectness.", ref: "Colossians 3:14" },
          { text: "Let love be without dissimulation. Abhor that which is evil; cleave to that which is good.", ref: "Romans 12:9" },
          { text: "Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind.", ref: "Matthew 22:37" },
          { text: "Thou shalt love thy neighbour as thyself.", ref: "Matthew 22:39" },
          { text: "For God so loved the world, that he gave his only begotten Son.", ref: "John 3:16" },
          { text: "We love him, because he first loved us.", ref: "1 John 4:19" },
          { text: "By this shall all men know that ye are my disciples, if ye have love one to another.", ref: "John 13:35" },
          { text: "Charity shall cover the multitude of sins.", ref: "1 Peter 4:8" },
          { text: "Perfect love casteth out fear.", ref: "1 John 4:18" },
          { text: "Walk in love, as Christ also hath loved us.", ref: "Ephesians 5:2" }
        ],
        repentance: [
          { text: "If we confess our sins, he is faithful and just to forgive us our sins.", ref: "1 John 1:9" },
          { text: "Repent ye: for the kingdom of heaven is at hand.", ref: "Matthew 4:17" },
          { text: "Create in me a clean heart, O God; and renew a right spirit within me.", ref: "Psalm 51:10" },
          { text: "Let the wicked forsake his way, and the unrighteous man his thoughts: and let him return unto the LORD.", ref: "Isaiah 55:7" },
          { text: "He that covereth his sins shall not prosper: but whoso confesseth and forsaketh them shall have mercy.", ref: "Proverbs 28:13" },
          { text: "Wash you, make you clean; put away the evil of your doings from before mine eyes.", ref: "Isaiah 1:16" },
          { text: "Repent ye therefore, and be converted, that your sins may be blotted out.", ref: "Acts 3:19" },
          { text: "O Israel, return unto the LORD thy God; for thou hast fallen by thine iniquity.", ref: "Hosea 14:1" },
          { text: "Search me, O God, and know my heart: try me, and know my thoughts.", ref: "Psalm 139:23" },
          { text: "Come now, and let us reason together, saith the LORD: though your sins be as scarlet, they shall be as white as snow.", ref: "Isaiah 1:18" },
          { text: "Acquaint now thyself with him, and be at peace.", ref: "Job 22:21" },
          { text: "Blessed is he whose transgression is forgiven, whose sin is covered.", ref: "Psalm 32:1" },
          { text: "Turn ye unto me, saith the LORD of hosts, and I will turn unto you.", ref: "Zechariah 1:3" },
          { text: "I gave her space to repent.", ref: "Revelation 2:21" },
          { text: "Wash me throughly from mine iniquity, and cleanse me from my sin.", ref: "Psalm 51:2" }
        ]
      }
    };
  
    // ============================================
    // LIBROS PERMITIDOS PARA API
    // ============================================
    const REFLECTIVE_BOOKS = {
      es: [
        'salmos', 'proverbios', 'eclesiastes', 'cantares',
        'isaias', 'jeremias', 'lamentaciones', 'daniel',
        'oseas', 'joel', 'miqueas', 'job',
        'mateo', 'marcos', 'lucas', 'juan',
        'romanos', '1corintios', '2corintios', 'galatas',
        'efesios', 'filipenses', 'colosenses',
        '1tesalonicenses', '2tesalonicenses',
        '1timoteo', '2timoteo', 'tito', 'filemon',
        'hebreos', 'santiago', '1pedro', '2pedro',
        '1juan', '2juan', '3juan', 'judas', 'apocalipsis'
      ],
      en: [
        'psalms', 'proverbs', 'ecclesiastes', 'song of solomon',
        'isaiah', 'jeremiah', 'lamentations', 'daniel',
        'hosea', 'joel', 'micah', 'job',
        'matthew', 'mark', 'luke', 'john',
        'romans', '1corinthians', '2corinthians', 'galatians',
        'ephesians', 'philippians', 'colossians',
        '1thessalonians', '2thessalonians',
        '1timothy', '2timothy', 'titus', 'philemon',
        'hebrews', 'james', '1peter', '2peter',
        '1john', '2john', '3john', 'jude', 'revelation'
      ]
    };
  
    const CHAPTERS_TO_AVOID = {
      'mateo': [1], 'matthew': [1],
      'lucas': [1, 3], 'luke': [1, 3],
      '1cronicas': [1,2,3,4,5,6,7,8,9],
      '1chronicles': [1,2,3,4,5,6,7,8,9],
    };
  
    // ============================================
    // FUNCIONES DEL FONDO CELESTIAL
    // ============================================
    function createCelestialElements() {
      const bg = document.getElementById('celestialBg');
      
      // Crear estrellas
      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 4 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        bg.appendChild(star);
      }
      
      // Crear iconos religiosos flotantes
      const iconClasses = [
        'fa-cross', 'fa-dove', 'fa-angel', 'fa-church', 
        'fa-star-of-david', 'fa-hands-praying', 'fa-cloud-moon',
        'fa-feather-alt', 'fa-bible', 'fa-menorah'
      ];
      
      for (let j = 0; j < 15; j++) {
        const icon = document.createElement('i');
        const randomIcon = iconClasses[Math.floor(Math.random() * iconClasses.length)];
        icon.className = `fas ${randomIcon} icon-constellation`;
        icon.style.left = `${Math.random() * 92}%`;
        icon.style.top = `${Math.random() * 88}%`;
        icon.style.fontSize = `${Math.random() * 2.5 + 1.8}rem`;
        icon.style.animationDelay = `${Math.random() * 7}s`;
        bg.appendChild(icon);
      }
    }
  
    // ============================================
    // FUNCIONES DE VERSÍCULOS
    // ============================================
    
    // Verificar si un versículo fue usado recientemente
    function wasRecentlyUsed(ref) {
      return recentVerses.includes(ref);
    }
  
    // Agregar al historial reciente
    function addToRecent(ref) {
      recentVerses.unshift(ref);
      if (recentVerses.length > MAX_RECENT) {
        recentVerses.pop();
      }
    }
  
    // Obtener versículo curado aleatorio
    function getRandomCuratedVerse() {
      const pool = CURATED_VERSES[currentLang];
      const moods = currentMood === 'all' 
        ? Object.keys(pool) 
        : [currentMood];
      
      // Recopilar todos los versículos de las categorías seleccionadas
      let availableVerses = [];
      moods.forEach(mood => {
        if (pool[mood]) {
          availableVerses = availableVerses.concat(pool[mood]);
        }
      });
  
      // Filtrar versículos recientes (si hay suficientes disponibles)
      const freshVerses = availableVerses.filter(v => !wasRecentlyUsed(v.ref));
      const versePool = freshVerses.length > 0 ? freshVerses : availableVerses;
      
      // Seleccionar aleatorio
      const randomIndex = Math.floor(Math.random() * versePool.length);
      return versePool[randomIndex];
    }
  
    // API: Obtener versículo aleatorio de la API bíblica
    async function fetchVerseFromAPI() {
      const books = REFLECTIVE_BOOKS[currentLang];
      const randomBook = books[Math.floor(Math.random() * books.length)];
      
      // Evitar capítulos no deseados
      const avoidChapters = CHAPTERS_TO_AVOID[randomBook] || [];
      let randomChapter;
      do {
        randomChapter = Math.floor(Math.random() * 20) + 1;
      } while (avoidChapters.includes(randomChapter));
      
      const randomVerse = Math.floor(Math.random() * 20) + 1;
      const version = currentLang === 'es' ? 'rv1960' : 'kjv';
      const url = `https://bible-api.com/${encodeURIComponent(randomBook)}+${randomChapter}:${randomVerse}?translation=${version}`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        const text = data.text || (data.verses && data.verses[0]?.text);
        
        // Verificar que sea reflexivo
        if (text && isVerseReflective(text)) {
          const bookName = randomBook.charAt(0).toUpperCase() + randomBook.slice(1);
          return {
            text: text.trim(),
            ref: `${bookName} ${randomChapter}:${randomVerse}`
          };
        }
        return null;
      } catch (error) {
        return null;
      }
    }
  
    // Filtrar si un versículo es reflexivo
    function isVerseReflective(text) {
      if (!text || text.length < 30 || text.length > 500) return false;
      
      const reflectiveKeywords = {
        es: [
          'bienaventurado', 'amor', 'paz', 'fe', 'esperanza', 'salvación',
          'arrepentimiento', 'perdón', 'misericordia', 'gracia', 'sabiduría',
          'consuelo', 'fortaleza', 'confianza', 'promesa', 'vida eterna',
          'no temas', 'venid', 'orad', 'velad', 'alegraos', 'corazón',
          'espíritu', 'oración', 'alabanza', 'santo', 'justicia'
        ],
        en: [
          'blessed', 'love', 'peace', 'faith', 'hope', 'salvation',
          'repentance', 'forgiveness', 'mercy', 'grace', 'wisdom',
          'comfort', 'strength', 'trust', 'promise', 'eternal life',
          'fear not', 'come unto', 'pray', 'rejoice', 'heart',
          'spirit', 'prayer', 'praise', 'holy', 'righteousness'
        ]
      };
      
      const lowerText = text.toLowerCase();
      const keywords = reflectiveKeywords[currentLang];
      const matchCount = keywords.filter(k => lowerText.includes(k)).length;
      
      return matchCount >= 1;
    }
  
    // Obtener versículo (híbrido: curado + API)
    async function getReflectiveVerse() {
      // 60% curado, 40% API
      if (Math.random() < 0.6) {
        return getRandomCuratedVerse();
      }
      
      // Intentar API (hasta 3 intentos)
      for (let i = 0; i < 3; i++) {
        const verse = await fetchVerseFromAPI();
        if (verse && !wasRecentlyUsed(verse.ref)) {
          return verse;
        }
      }
      
      // Fallback a curado
      return getRandomCuratedVerse();
    }
  
    // Contar versículos disponibles
    function countAvailableVerses() {
      const pool = CURATED_VERSES[currentLang];
      let total = 0;
      
      if (currentMood === 'all') {
        Object.values(pool).forEach(verses => {
          total += verses.length;
        });
      } else {
        total = pool[currentMood]?.length || 0;
      }
      
      return {
        curated: total,
        apiInfinite: true,
        total: total + (total * 0.4) // Estimación con API
      };
    }
  
    // ============================================
    // FUNCIONES UI
    // ============================================
    const elements = {
      verseText: document.getElementById('verseText'),
      verseCitation: document.getElementById('verseCitation'),
      categoryTag: document.getElementById('categoryTag'),
      appTitle: document.getElementById('appTitle'),
      newVerseLabel: document.getElementById('newVerseLabel'),
      downloadLabel: document.getElementById('downloadLabel'),
      footerText: document.getElementById('footerText'),
      counterText: document.getElementById('counterText'),
      langEsBtn: document.getElementById('langEsBtn'),
      langEnBtn: document.getElementById('langEnBtn'),
      newVerseBtn: document.getElementById('newVerseBtn'),
      downloadBtn: document.getElementById('downloadBtn'),
    };
  
    async function loadNewVerse() {
      elements.verseText.style.opacity = '0.4';
      elements.verseText.textContent = currentLang === 'es' ? 
        'Buscando versículo reflexivo...' : 
        'Searching for a reflective verse...';
      elements.verseText.classList.add('loading');
      
      const verse = await getReflectiveVerse();
      
      elements.verseText.textContent = `"${verse.text}"`;
      elements.verseCitation.textContent = verse.ref;
      elements.verseText.classList.remove('loading');
      elements.verseText.style.opacity = '1';
      
      // Actualizar categoría
      const moodNames = {
        comfort: { es: 'Consuelo', en: 'Comfort', icon: 'fa-dove' },
        wisdom: { es: 'Sabiduría', en: 'Wisdom', icon: 'fa-lightbulb' },
        hope: { es: 'Esperanza', en: 'Hope', icon: 'fa-star' },
        love: { es: 'Amor', en: 'Love', icon: 'fa-heart' },
        repentance: { es: 'Perdón', en: 'Repentance', icon: 'fa-pray' }
      };
      
      // Detectar categoría del versículo
      let detectedMood = 'all';
      for (const mood in CURATED_VERSES[currentLang]) {
        if (CURATED_VERSES[currentLang][mood].some(v => v.ref === verse.ref)) {
          detectedMood = mood;
          break;
        }
      }
      
      if (detectedMood !== 'all' && moodNames[detectedMood]) {
        const moodInfo = moodNames[detectedMood];
        elements.categoryTag.innerHTML = `<i class="fas ${moodInfo.icon}"></i> ${moodInfo[currentLang]}`;
      } else {
        elements.categoryTag.innerHTML = `<i class="fas fa-book-bible"></i> ${currentLang === 'es' ? 'Reflexión' : 'Reflection'}`;
      }
      
      // Actualizar contador
      totalVersesGenerated++;
      addToRecent(verse.ref);
      updateCounter();
    }
  
    function updateCounter() {
      const stats = countAvailableVerses();
      const esText = `${stats.curated}+ versículos disponibles`;
      const enText = `${stats.curated}+ verses available`;
      elements.counterText.textContent = currentLang === 'es' ? esText : enText;
    }
  
    function updateUILanguage() {
      if (currentLang === 'es') {
        elements.appTitle.textContent = 'ALIENTO DIVINO';
        elements.newVerseLabel.textContent = 'Nuevo Versículo';
        elements.downloadLabel.textContent = 'Descargar Imagen';
        elements.footerText.textContent = 'Medita · Ora · Reflexiona';
        document.title = 'Refugio Celestial · Meditación Bíblica';
        elements.langEsBtn.classList.add('active');
        elements.langEnBtn.classList.remove('active');
      } else {
        elements.appTitle.textContent = 'DIVINE WHISPER';
        elements.newVerseLabel.textContent = 'New Verse';
        elements.downloadLabel.textContent = 'Download Image';
        elements.footerText.textContent = 'Meditate · Pray · Reflect';
        document.title = 'Celestial Refuge · Bible Meditation';
        elements.langEnBtn.classList.add('active');
        elements.langEsBtn.classList.remove('active');
      }
      updateCounter();
    }
  
    async function downloadAsImage() {
      const captureElements = {
        title: document.getElementById('captureTitle'),
        verseText: document.getElementById('captureVerseText'),
        citation: document.getElementById('captureCitation'),
        footer: document.getElementById('captureFooter'),
        categoryTag: document.getElementById('captureCategoryTag'),
      };
      
      captureElements.title.textContent = elements.appTitle.textContent;
      captureElements.verseText.textContent = elements.verseText.textContent;
      captureElements.citation.textContent = elements.verseCitation.textContent;
      captureElements.footer.textContent = elements.footerText.textContent;
      captureElements.categoryTag.innerHTML = elements.categoryTag.innerHTML;
  
      const captureCard = document.getElementById('captureCard');
      
      try {
        const canvas = await html2canvas(captureCard, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });
        
        const ref = elements.verseCitation.textContent
          .replace(/\s+/g, '-')
          .replace(/[,:]/g, '')
          .toLowerCase();
        const link = document.createElement('a');
        link.download = `refugio-celestial-${ref}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error al descargar:', error);
        alert(currentLang === 'es' ? 
          'Error al generar la imagen. Intenta de nuevo.' : 
          'Error generating image. Please try again.');
      }
    }
  
    function changeMood(mood, button) {
      currentMood = mood;
      
      // Actualizar botones de mood
      document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      
      // Cargar nuevo versículo
      loadNewVerse();
    }
  
    // ============================================
    // EVENT LISTENERS
    // ============================================
    elements.newVerseBtn.addEventListener('click', loadNewVerse);
    elements.downloadBtn.addEventListener('click', downloadAsImage);
  
    elements.langEsBtn.addEventListener('click', () => {
      if (currentLang === 'es') return;
      currentLang = 'es';
      updateUILanguage();
      loadNewVerse();
    });
  
    elements.langEnBtn.addEventListener('click', () => {
      if (currentLang === 'en') return;
      currentLang = 'en';
      updateUILanguage();
      loadNewVerse();
    });
  
    // Event listeners para botones de mood
    document.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mood = btn.dataset.mood;
        changeMood(mood, btn);
      });
    });
  
    // Atajo de teclado: Espacio para nuevo versículo
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        loadNewVerse();
      }
    });
  
    // ============================================
    // INICIALIZACIÓN
    // ============================================
    function init() {
      createCelestialElements();
      updateUILanguage();
      loadNewVerse();
    }
  
    init();
  })();