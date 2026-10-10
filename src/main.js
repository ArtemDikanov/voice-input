import "./styles/main.scss";

const buttonRecord = document.querySelector(".main__button-record")
const status = document.querySelector(".main__statusBlock-text")
const textBlock = document.querySelector(".main__text")
const buttonCopy = document.querySelector(".main__button-copy")
const errorDialog = document.querySelector(".main__errorDialog")
const dialogText = document.querySelector(".contentDialog__text")
const dialogButton = document.querySelector(".contentDialog__button")

dialogButton.addEventListener("click", () => {
    errorDialog.close()
})

const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!speechRecognition) {
    buttonRecord.disabled = true;
    textBlock.disabled = true;
    buttonCopy.disabled = true;
    errorDialog.showModal()
}
else {
    const recognition = new speechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = true;
    recognition.interimResults = true;

    let isRecording = false;  
    let finalText = '';  
    
    recognition.onresult = (event) => {
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal && event.results[i][0].confidence > 0) {
                finalText += event.results[i][0].transcript + ' '
            }
            else {
                interim += event.results[i][0].transcript + ' '
            }
        }

        textBlock.value = finalText + interim;
        if (finalText) {
            buttonCopy.disabled = false;
        }
    }

    recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
            isRecording = false
            buttonRecord.textContent = "Начать запись"
            status.textContent = ''
            dialogText.textContent = "Возникла проблемка! Нажми на три точки в правом врехнем углу -> Настройки -> Настройки сайтов -> Микрофон"
            errorDialog.showModal()
        }
        if (event.error === 'audio-capture') {
            status.textContent = "Что-то не так с микрофоном..."
        }
        if (event.error === 'network') {
            status.textContent = "Отсутствует подключение к интернету :("
        }
    };

    buttonRecord.addEventListener ("click", () => {
        if (isRecording === false) {
            textBlock.value = '';
            finalText = '';
            buttonCopy.disabled = true;
            isRecording = true;
            recognition.start();
            buttonRecord.textContent = 'Остановить запись';
            status.textContent = "Записываю...";
            
        }
        else {
            isRecording = false;
            recognition.stop();
            buttonRecord.textContent = 'Начать запись';
            status.textContent = "Я дослющаль";
        }
    })

    recognition.onend = () => {
        if (isRecording) {
            try {
                recognition.start();
                status.textContent = "Слушаю...";
            } catch (e) {
            }
        }
    };

    buttonCopy.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(textBlock.value);
            buttonCopy.textContent = "Скопировано!"
            setTimeout(() => {
                buttonCopy.textContent = "Скопировать текст"
            }, 1500)
        } catch (err) {
            buttonCopy.textContent = "Ошибка :("
            setTimeout(() => {
                buttonCopy.textContent = "Скопировать текст"
            }, 1500)
        }
    })
}


