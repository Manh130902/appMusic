const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $('header h2');
const cdThumb =$('.cd-thumb');
const audio = $('#audio'); 
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const timer = $('.time-remain');
const playlist = $('.playlist');
const progress= $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const audioVolume = $('.audio-volume');
const currentVolume = $('.current-volume');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Lời Tạm Biệt Chưa Nói',
            singer: 'DatLoGREY D & ORANGE, Kai Đinh',
            path: './assets/music/LoiTamBietChuaNoi-GREYDDoanTheLanOrange-7613756.mp3',
            image: './assets/img/loitambietchuanoi.jpg'
        },
        {
            name: '3107 3',
            singer: 'Nâu, Duongg, Titie',
            path: './assets/music/31073-WnDuonggNauTitie-7058449_hq.mp3',
            image: './assets/img/31073.jpg'
        },
        {
            name: 'Quên Đặt Tên',
            singer: 'Phạm Nguyên Ngọc',
            path: './assets/music/QuenDatTen-PhamNguyenNgocBMZ-7584302.mp3',
            image: './assets/img/quendatten.jpg'
        },
        {
            name: 'Bức Tranh Từ Nước Mắt',
            singer: 'Mr.Siro',
            path: './assets/music/BucTranhTuNuocMat-MrSiro-2741834.mp3',
            image: './assets/img/buctranhtunuocmat.jpg'
        },
        {
            name: 'Những Phút Giây Ban Đầu',
            singer: 'Bùi Anh Tuấn',
            path: './assets/music/NhungPhutGiayBanDau-BuiAnhTuan-2833113_hq.mp3',
            image: './assets/img/nhugiayphutbandau.jpg'
        },
        {
            name: 'Em Không Khóc',
            singer: 'buitruonglinh',
            path: './assets/music/EmKhongKhoc-buitruonglinhVuPhungTien-7168105.mp3',
            image: './assets/img/emkhongkhoc.jpg'
        },
        {
            name: 'Pháo Hồng',
            singer: 'DatLongVinh',
            path: './assets/music/PhaoHong-DatLongVinh-7582920.mp3',
            image: './assets/img/phaohong.jpg'
        },
        {
            name: 'Bên Trên Tầng Lầu',
            singer: 'TangDuyTan',
            path: './assets/music//BenTrenTangLau-TangDuyTan-7580542.mp3',
            image: './assets/img/bentrentanglau.jpg'
        },
        {
            name: 'Câu Hẹn Câu Thề',
            singer: 'Đình Dũng',
            path: './assets/music/CauHenCauThe-DinhDung-6994741.mp3',
            image: './assets/img/cauhencauthe.jpg'
        },
        {
            name: 'Níu Duyên',
            singer: 'Lê Bảo Bình',
            path: './assets/music/NiuDuyen-LeBaoBinh-6872127.mp3',
            image: './assets/img/niuduyen.jpg'
        },
        
    ],
    render: function(){
        const html = this.songs.map((song, index) =>{
            return `
                <div class="song ${index === this.currentIndex? 'active' : ''}" data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}') ;">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = html.join('');
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvent: function(){
        const cdWidth = cd.offsetWidth

        //xử lí CD quay và dừng
        cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)' }
        ],{
            duration: 10000,
            iterations: Infinity
        })

        cdThumbAnimate.pause()
        //xử lí CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth >0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // //bắt event play
        playBtn.onclick = function() {
            if(app.isPlaying){         
                audio.pause();
            }else{           
                audio.play();
            }
        }

        //khi song dc play
        audio.onplay = function(){
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //khi song bị pause
        audio.onpause = function(){
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // update thời gian bài hát
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
                const timeRemain = audio.duration - audio.currentTime;
                let timeRemainAsMinute;
                if(Math.floor(timeRemain % 60) < 10){
                    timeRemainAsMinute = (timeRemain- ( timeRemain%60 )) / 60 + ':0' + Math.floor(timeRemain %60);
                    timer.textContent = timeRemainAsMinute;
                }else{
                    timeRemainAsMinute = (timeRemain- ( timeRemain%60 )) / 60 + ':' + Math.floor(timeRemain %60);
                    timer.textContent = timeRemainAsMinute;
                }
            }
        }

        // xử lý âm lượng
        audioVolume.oninput = function(e) {
            audio.volume = e.target.value / audioVolume.max
            currentVolume.textContent = e.target.value
        }

        // xử lí khi tua bài hát
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // xử lý next bài
        nextBtn.onclick = function(){
            if(app.isRandom){
                app.playRamdomSong();
            }else{
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }
         // xử lý prev bài
         prevBtn.onclick = function(){
            if(app.isRandom){
                app.playRamdomSong();
            }else{
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        // ramdom bai hat
        randomBtn.onclick = function(e){
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle('active', app.isRandom);
        }
        // xử lí lặp lại 1 bài hát
        repeatBtn.onclick = function(){
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active', app.isRepeat);
        }

        //xử lí khi kết thúc bài hát
        audio.onended = function(){
            if(app.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }
        // xử lý khi click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)') 

            // xử lí khi click vào song
            if(e.target.closest('.song:not(.active)') || e.target.closest('.option')){
                if(songNode){
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }
            }
        }
    },
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        },300);
    },
    loadCurrentSong: function(){  
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex <0){
            this.currentIndex = this.songs.length-1;
        }
        this.loadCurrentSong();
    },
    playRamdomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex === this.currentIndex);
        
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    info: function(){
        // hiển thị âm lượng khi vừa vào 
        currentVolume.textContent = `${audioVolume.value}`
        audio.volume = audioVolume.value / audioVolume.max

        // hiển thị thời gian khi vừa vào
        if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
            progress.value = progressPercent;
            const timeRemain = audio.duration - audio.currentTime;
            let timeRemainAsMinute;
            if(Math.floor(timeRemain % 60) < 10){
                timeRemainAsMinute = (timeRemain- ( timeRemain%60 )) / 60 + ':0' + Math.floor(timeRemain %60);
                timer.textContent = timeRemainAsMinute;
            }else{
                timeRemainAsMinute = (timeRemain- ( timeRemain%60 )) / 60 + ':' + Math.floor(timeRemain %60);
                timer.textContent = timeRemainAsMinute;
            }
        }else{
            timer.textContent = '00:00';
        }
    },
    start: function(){

        this.info();

        // định nghĩa các thuộc tính cho obj
        this.defineProperties();

        // lắng nghe / xử lý các event trong DOM events
        this.handleEvent();

        // Tải bài hoát đầu tiên khi vào 
        this.loadCurrentSong();

        // Render playlist
        this.render();
    }
}

app.start()
