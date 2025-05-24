fetching_Sorah_names();
const ayat_text = document.getElementById('ayat');
let Sorah;
let sorah_name_data_json;
const sorah_top = document.querySelector('.sorah_top_Name');
const sorah_hizb = document.querySelector('.sorah_top_Hizb');
const sorah_Number = document.querySelector('.sorah_top_Number');
function convertToArabicNumbers(number) {
    const arabicDigits = {
        '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
        '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
    };
    return number.toString().split('').map(digit => arabicDigits[digit]).join('');
}
const basmalah = document.getElementById('basmalah');
async function fetching_Ayat(num) {
    try {
        let Ayat = await fetch('quran.json');  
        let Ayat_data_json = await Ayat.json();
        ayat_text.innerText = '';
        let localnum = localStorage.getItem("Sorah Number");
        const surah = Ayat_data_json[`${localnum}`];
        
        if (sorah_top) {
            sorah_Number.innerText = "";
            sorah_hizb.innerText = "";
            sorah_top.innerText = "";
            sorah_top.innerText = `${sorah_name_data_json[localnum - 1]['name']}`;
            sorah_Number.innerText += "ترتيبها ";
            sorah_Number.innerHTML += '<br>';
            sorah_Number.innerText += `${convertToArabicNumbers(sorah_name_data_json[localnum - 1]['id'])}`;
            sorah_hizb.innerText += "اياتها  ";
            sorah_hizb.innerHTML += '<br>';
            sorah_hizb.innerText += `${convertToArabicNumbers(sorah_name_data_json[localnum - 1]['total_verses'])}`;
        }
        
        for (let i = 0; i < surah.length; i++) {
            ayat_text.innerText += surah[i].text + '  '; 
            ayat_text.innerText += convertToArabicNumbers(i + 1); 
        }
    } catch (error) {
        console.error(error);
    }
}
const Sorah_names = document.getElementById('sorah_aside');
async function fetching_Sorah_names() {
    try {
        Sorah = await fetch('سور القران.json');
        sorah_name_data_json = await Sorah.json();
        for (let i = 0; i < sorah_name_data_json.length; i++) {
            Sorah_names.innerHTML += `
                <li onclick="sorahPage(${i + 1})" id="SorahList${i + 1}">
                    <p class="Sorah_name_aside">${sorah_name_data_json[i]['name']}</p>
                    <p class="Sorah_number_aside">سورة رقم ${i + 1}</p>
                    <p class="Sorah_number_aside">عدد اياتها ${sorah_name_data_json[i]['total_verses']}</p>
                </li>`;
        }
    } catch (error) {
        console.error(error);
    }
}
function sorahPage(sorah_num) {
    document.location.href = "/existing page/index.html";
    fetch("/QURAAN/state.json")
    .then(response => response.json())
    .then(data =>{
        data.updatedAt = new Date().toISOString();
        return fetch('state.json', {
            method: 'PUT',
            headers: {
                'selected surah': `${sorah_num}`
            },
            body: JSON.stringify(data)
        });
    })
    .then(response => response.json())
    .then(updatedData => console.log('Updated Data:', updatedData))
    .catch(error => console.error('Error:', error));
}
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
function applyTheme(isDark) {
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.querySelector("nav .logo img").src = '/existing page/quraan-dark.png'
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.querySelector("nav .logo img").src = '/existing page/quraan-light.png'
        localStorage.setItem('theme', 'light');
    }
}
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    toggleSwitch.checked = true;
    applyTheme(true);
}
toggleSwitch.addEventListener('change', (e) => {
    applyTheme(e.target.checked);
});
if (currentTheme === 'system' || (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    toggleSwitch.checked = true;
    applyTheme(true);
}