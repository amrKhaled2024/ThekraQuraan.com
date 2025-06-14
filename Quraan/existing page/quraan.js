const ayat_text = document.getElementById('ayat');
const Sorah_names = document.getElementById('sorah_aside');
const sorah_top = document.querySelector('.sorah_top_Name');
const sorah_hizb = document.querySelector('.sorah_top_Hizb');
const sorah_Number = document.querySelector('.sorah_top_Number');
const basmalah = document.getElementById('basmalah');
const aside = document.querySelector('aside');
const homeLink = document.getElementById('home-link');
const logoImg = document.getElementById('logo-img');

let Ayat_data_json = null;
let sorah_name_data_json = null;
let currentSurah = 1; 

async function initApp() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const surahParam = urlParams.get('surah');
        currentSurah = surahParam ? parseInt(surahParam) : localStorage.getItem("Sorah Number") || 1;

        const [quranRes, surahRes] = await Promise.all([
            fetch('quran.json'),
            fetch('سور القران.json')
        ]);
        
        Ayat_data_json = await quranRes.json();
        sorah_name_data_json = await surahRes.json();
        
        renderSurahList();
        loadSurah(currentSurah);
        initTheme();
        setupNavigation();
    } catch (error) {
        console.error("Error initializing app:", error);
    }
}

function renderSurahList() {
    let html = '';
    sorah_name_data_json.forEach((surah, index) => {
        html += `
            <li onclick="navigateToSurah(${surah.id})" id="SorahList${surah.id}" 
                class="${surah.id == currentSurah ? 'active_sorah' : ''}">
                <a href="?surah=${surah.id}" data-surah="${surah.id}" class="surah-link">
                    <p class="Sorah_name_aside">${surah.name}</p>
                    <p class="Sorah_number_aside">سورة رقم ${surah.id}</p>
                    <p class="Sorah_number_aside">عدد اياتها ${surah.total_verses}</p>
                </a>
            </li>`;
    });
    Sorah_names.innerHTML = html;
}

function loadSurah(surahNum) {
    if (!Ayat_data_json || !sorah_name_data_json) return;
    
    currentSurah = surahNum;
    localStorage.setItem("Sorah Number", surahNum);
    
    // Update URL without page reload
    const newUrl = window.location.pathname + `?surah=${surahNum}`;
    window.history.pushState({ surah: surahNum }, '', newUrl);
    
    document.title = `سورة ${sorah_name_data_json.find(s => s.id == surahNum).name} | القرآن الكريم`;

    setTimeout(() => {
        const surahEl = document.getElementById(`SorahList${surahNum}`);
        if (surahEl) {
            surahEl.scrollIntoView({ 
                behavior: 'auto',
                block: 'center' 
            });
        }
    }, 50);

    const surahInfo = sorah_name_data_json.find(s => s.id == surahNum);
    if (surahInfo) {
        sorah_top.innerText = surahInfo.name;
        sorah_Number.innerHTML = `ترتيبها <br>${convertToArabicNumbers(surahInfo.id)}`;
        sorah_hizb.innerHTML = `اياتها <br>${convertToArabicNumbers(surahInfo.total_verses)}`;
    }

    const surah = Ayat_data_json[surahNum];
    if (surah) {
        let ayahText = '';
        for (let i = 0; i < surah.length; i++) {
            ayahText += surah[i].text + ' ' + convertToArabicNumbers(i + 1) + ' ';
        }
        ayat_text.innerText = ayahText;
    }

    basmalah.style.display = surahNum == 9 ? "none" : "block";
    
    document.querySelectorAll("#sorah_aside li").forEach(li => {
        li.classList.remove("active_sorah");
    });
    document.getElementById(`SorahList${surahNum}`).classList.add("active_sorah");
}

function convertToArabicNumbers(number) {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return number.toString().split('').map(digit => arabicDigits[digit]).join('');
}

function navigateToSurah(surahNum) {
    loadSurah(surahNum);
}

function initTheme() {
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggleSwitch.checked = true;
        logoImg.src = '/existing page/quraan-dark.png';
    }
    
    toggleSwitch.addEventListener('change', function(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            logoImg.src = '/existing page/quraan-dark.png';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            logoImg.src = '/existing page/quraan-light.png';
            localStorage.setItem('theme', 'light');
        }
    });
}

function setupNavigation() {
    window.addEventListener('popstate', (event) => {
        const urlParams = new URLSearchParams(window.location.search);
        const surahParam = urlParams.get('surah');
        if (surahParam) {
            loadSurah(parseInt(surahParam));
        } else {
            loadSurah(1);
        }
    });

    document.addEventListener('click', (e) => {
        const surahLink = e.target.closest('.surah-link');
        if (surahLink) {
            e.preventDefault();
            const surahNum = parseInt(surahLink.getAttribute('data-surah'));
            navigateToSurah(surahNum);
        }
        
        if (e.target.closest('#home-link')) {
            e.preventDefault();
            window.history.pushState({}, '', '/');
            loadSurah(1);
        }
    });
}

document.addEventListener('DOMContentLoaded', initApp);