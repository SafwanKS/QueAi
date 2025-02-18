window.onload = () =>{
  class QueAi{
    constructor(){
      this.prop = ""
      this.rootDiv = document.getElementById('root')
    }
    
    
    mainActivity(){
      this.rootDiv.innerHTML = `
      <header>
      <div class="headcol">
        <div class="smallBtn">
        <span class="material-symbols-outlined">menu</span>
      </div>
      </div>
      <div class="headcol">
        <h3 style="pointer-events: none;">New Chat</h3>
      </div>
      <div class="headcol">
        <div class="smallBtn">
        <span class="material-symbols-outlined">edit</span>
      </div>
      </div>
    </header>
    <main>
      
      <div class="homeScreen">
        <h2 style="text-align: center">How can i help <br> you today ?</h2>
        <img src="./src/logosmall.png" alt="">
      </div>
      
      <div class="chatScreen">
        <ul class="chatList">
            <!-- Chats -->
        </ul>
      </div>
      
    </main>
    <footer>
      <div class="typeBox">
        <div class="smallBtn" id="attachBtn">
          <span class="material-symbols-outlined">add</span>
        </div>
      
        <textarea type="text" rows="1" cols="" placeholder="Enter prompt here..." id="promptText"></textarea>
      
        <div class="smallBtn" id="sendBtn">
          <span class="material-symbols-outlined">send</span>
        </div>
      </div>
    </footer>
      
      `
      
      alert(decodeURI(location.pathname.split('/').pop()))
      var prompt
      var homePage = document.querySelector('.homeScreen')
      var chatScreen = document.querySelector('.chatScreen')
      var chatList = document.querySelector('.chatList')
      var inputBox = document.getElementById('promptText')
      var sendBtn = document.querySelector('#sendBtn')
      var attachBtn = document.querySelector('#attachBtn')
      var typeBox = document.querySelector('.typeBox')
      
      sendBtn.classList.add('inactive')
      
      
      
inputBox.addEventListener('input', () => {
  inputBox.rows = inputBox.value.split('\n').length;
  inputBox.style.height = 'auto';
  inputBox.style.height = inputBox.scrollHeight + 'px';
  chatScreen.style.paddingBottom = typeBox.scrollHeight + 40 + "px"
  chatScreen.scrollTop = chatScreen.scrollHeight
  if(inputBox.value.length > 0){
    sendBtn.classList.remove('inactive')
  }else{
    sendBtn.classList.add('inactive')
  }
});

      
      document.getElementById('sendBtn').addEventListener('click', ()=>{
        setTimeout(()=>{
          chatScreen.scrollTop = chatScreen.scrollHeight
          
        }, 100)
        
        document.querySelector('body').focus()
        chatScreen.style.paddingBottom = typeBox.scrollHeight + 40 + "px"
        
        prompt = inputBox.value
        homePage.style.display = "none"
        chatScreen.style.display = 'block'
        chatList.innerHTML += `
          <li class="chatItem user">
            <pre id="msgTxt">${prompt}</pre>
          </li>
        `
        inputBox.value = ""
        inputBox.style.height = inputBox.scrollHeight + "px"
        sendBtn.classList.add('inactive')
        inputBox.classList.add('inactive')
        attachBtn.classList.add('inactive')
        setTimeout(()=>{
          chatList.innerHTML += `
            <li class="chatItem">
              <img src="./src/logosmall.png" alt="./src/logosmall.png">
              <pre id="msgTxt"class="think loadingBar">Thinking...</pre>
            </li>
          `
          chatScreen.scrollTop = chatScreen.scrollHeight
        }, 300)
        
        const history = []
        
        chatList.childNodes.forEach((chat)=>{
          if(chat.nodeType === 1){
            const role = chat.classList.contains('user') ? 'user' : 'model'
            const text = chat.querySelector('#msgTxt').textContent
            history.push({role, parts: [{text}]})
          }
        })
        
        
        fetch('/askai', 
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            prompt:prompt,
            history: history
          })
        })
        .then(response => response.json())
        .then(data => {
          var response = data.responseText
          
          var list = document.querySelectorAll('.chatItem')
          var lastIndex = list[list.length - 1]
          var textElement = lastIndex.querySelector('pre')
          textElement.classList.remove('loadingBar', 'think')
          if(textElement.textContent == 'Thinking...'){
              textElement.innerHTML = ''
            }
            
          let text = response
          text = text.replace(/\*\*(.*?)\*\*/g, '<span style="color: #682EA6; filter: brightness(2)">$1</span>');
          text = text.replace(/\*/g, '•')
          
          text = text.replace(/```(.*?)```/gs, (match, p1) => {
                    const escapedCode = p1.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    
                    let lang = text.match(/```(.*?)\n(.*?)\n```/s)[1]
                    return `<div><div class="codehead">${lang.charAt(0).toUpperCase()}${lang.slice(1)}</div><div class="code">${escapedCode.replace(lang, '').replace(/\n/, '')}</div></div>`;
                  }); 
          response = response.replace(/\*/g, '•')
          response = response.replace(/\*\*(.*?)\*\*/g, '$1');
          const words = response.split(' ')
          let currentWordIndex = 0
          const typingInterval = setInterval(()=>{
            
            textElement.textContent += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++]
            chatScreen.scrollTop = chatScreen.scrollHeight
            if(currentWordIndex === words.length){
              clearInterval(typingInterval)
              
              textElement.innerHTML = text
              
              
              sendBtn.classList.remove('inactive')
            inputBox.classList.remove('inactive')
            attachBtn.classList.remove('inactive')
            }
            
          }, 70)
        })
        .catch(error =>{
          console.log({error})
          var response = 'Something went wrong!'
          setTimeout(()=>{
            var list = document.querySelectorAll('.chatItem')
          var lastIndex = list[list.length - 1]
          var textElement = lastIndex.querySelector('pre')
          textElement.classList.remove('loadingBar', 'think')
          if(textElement.textContent == 'Thinking...'){
              textElement.innerHTML = ''
            }
          
          const words = response.split(' ')
          let currentWordIndex = 0
          const typingInterval = setInterval(()=>{
            
            textElement.textContent += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++]
            chatScreen.scrollTop = chatScreen.scrollHeight
            if(currentWordIndex === words.length){
              clearInterval(typingInterval)
              sendBtn.classList.remove('inactive')
            inputBox.classList.remove('inactive')
            attachBtn.classList.remove('inactive')
            }
            
          }, 70)
          }, 300)
        })
        
        
        
        
      })
      
      
    }
  }
  
  const app = new QueAi()
  //app.mainActivity()
}