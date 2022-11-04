const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'mp3-player';

const playlist = $('.playlist');
const header = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const player = $('.player');
const progress = $('.progress');
const btnNext = $('.btn-next');
const btnPrev = $('.btn-prev');
const btnRandom = $('.btn-random');
const btnRepeat = $('.btn-repeat');

const app = {
  currentIndex: 0,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: 'vaicaunoicokhiennguoithaydoi',
      singer: 'GreyD',
      path: 'https://mp3-s1-zmp3.zmdcdn.me/55226a6e9c2f75712c3e/3766125175965205028?authen=exp=1667698560~acl=/55226a6e9c2f75712c3e/*~hmac=ac0d56c56b3c261a3b555b7a6274ff75&fs=MTY2NzUyNTmUsIC2MDU1OHx3ZWJWNnwxMDE2MDQ5NzMxfDE0LjE2NC41Ni4xMDY&filename=vaicaunoicokhiennguoithaydoi-GREY-D-tlinh.mp3',
      image: 'https://i.ytimg.com/vi/2iidlwQ-NfU/mqdefault.jpg',
    },
    {
      name: 'Lose you',
      singer: 'TRI',
      path: 'https://vnso-zn-15-tf-mp3-s1-zmp3.zmdcdn.me/af0bc308c6492f177658/2789253625820837835?authen=exp=1667699382~acl=/af0bc308c6492f177658/*~hmac=78e6b0a4ce8456a91a5c1663238dc215&fs=MTY2NzUyNjU4MjY5OXx3ZWJWNnwxMDE2MDQ5NzMxfDE0LjE2NC41Ni4xMDY&filename=Lose-You-T-R-I-Rickie.mp3',
      image: 'https://i.ytimg.com/vi/ZCWxJkwD5wo/mqdefault.jpg',
    },
    {
      name: 'Chúng ta sau này',
      singer: 'TRI',
      path: 'https://c1-ex-swe.nixcdn.com/NhacCuaTui1010/ChungTaSauNay-TRI-6929586.mp3?st=cXI76wUdMSEV9Lyej4T9AA&e=1667613140&download=true',
      image: 'https://i.ytimg.com/vi/-Dp4uurHcJo/maxresdefault.jpg',
    },
    {
      name: 'Coming back',
      singer: 'TRI',
      path: 'https://c1-ex-swe.nixcdn.com/NhacCuaTui998/ComingBack-TRI-6270106.mp3?st=2c2_RrAvn0UmztLrdZwu9w&e=1667613217&download=true',
      image: 'https://i.ytimg.com/vi/XtLYHsn7jD4/maxresdefault.jpg',
    },
    {
      name: 'Ánh sao và bầu trời',
      singer: 'TRI',
      path: 'https://c1-ex-swe.nixcdn.com/NhacCuaTui1021/AnhSaoVaBauTroi-TRI-7085073.mp3?st=yLv_1W7pVL_NSTyvmgX9ww&e=1667612702&download=true',
      image:
        'https://avatar-ex-swe.nixcdn.com/song/share/2021/09/09/0/8/1/f/1631155238787.jpg',
    },
    {
      name: 'Waiting for you',
      singer: 'Mono',
      path: 'https://c1-ex-swe.nixcdn.com/NhacCuaTui2026/WaitingForYou-MONOOnionn-7733882.mp3?st=VveHPZUxzZqUenLgtldImA&e=1667612189&download=true',
      image: 'https://i.ytimg.com/vi/CHw1b_1LVBA/maxresdefault.jpg',
    },
    {
      name: 'Từng là của nhau',
      singer: 'Bảo Anh',
      path: 'https://c1-ex-swe.nixcdn.com/NhacCuaTui2027/TungLaCuaNhau-BaoAnhTao-7818322.mp3?st=Q4iLWceE2SDTdZBxp_18ZQ&e=1667613446&download=true',
      image: 'https://i.ytimg.com/vi/Udc6MAAZT30/maxresdefault.jpg',
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    let isPlaying = false;

    // Cd thumb quay
    const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Scroll thanh cuộn
    document.onscroll = function () {
      const scrollTop = window.scrollY;
      const newCdWidth = cdWidth - +scrollTop;

      cd.style.width = newCdWidth >= 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Nút play/pause
    const play = $('.btn-toggle-play');
    play.onclick = function () {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    audio.onplay = function () {
      isPlaying = true;
      player.classList.add('playing');
      cdThumbAnimate.play();
    };

    audio.onpause = function () {
      isPlaying = false;
      player.classList.remove('playing');
      cdThumbAnimate.pause();
    };

    // Tua nhạc
    audio.ontimeupdate = function () {
      const audioCurrentTime = audio.currentTime;
      const audioDuration = audio.duration;

      if (audioDuration) {
        progress.value = Math.floor((audioCurrentTime * 100) / audioDuration);
      }
    };

    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Play next
    btnNext.onclick = function () {
      if (_this.isRandom) {
        _this.loadRandomSong();
      } else {
        _this.loadNextSong();
      }
      _this.scrollIntoActiveSong(() => {
        audio.play();
      });
    };

    // Play prev
    btnPrev.onclick = function () {
      if (_this.isRandom) {
        _this.loadRandomSong();
      } else {
        _this.loadPrevSong();
      }
      _this.scrollIntoActiveSong(() => {
        audio.play();
      });
    };

    // Nhấn nút shuffle
    btnRandom.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom', _this.isRandom);
      btnRandom.classList.toggle('active', _this.isRandom);
    };

    // Nhấn nút repeat
    btnRepeat.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);
      btnRepeat.classList.toggle('active', _this.isRepeat);
    };

    audio.onended = function () {
      if (!_this.isRepeat) {
        btnNext.click();
      } else {
        audio.play();
      }
    };

    // Lắng nghe sự kiện khi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active');
      if (songNode || !e.target.closest('.song:not(.option)')) {
        if (songNode) {
          // songNode.getAttribute('data-index')
          _this.currentIndex = +songNode.dataset.index;
          _this.loadCurrentSong();
          audio.play();
        }

        // Xử lý khi click vào '...'
      }
    };
  },
  render: function () {
    const html = this.songs.map((song, index) => {
      return `
        <div class="song ${
          index === this.currentIndex ? 'active' : ''
        }" data-index="${index}">
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
    `;
    });
    playlist.innerHTML = html.join('');
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;

    // Object.assign(this, this.config);
  },
  loadCurrentSong: function () {
    header.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;

    const songs = $$('.song');
    songs.forEach((song, index) => {
      song.classList.remove('active');
      if (index === this.currentIndex) {
        song.classList.add('active');
      }
    });
  },
  loadNextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  loadPrevSong: function () {
    this.currentIndex--;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  loadRandomSong: function () {
    let newIndex;

    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  scrollIntoActiveSong: function (cb) {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: this.currentIndex == 0 ? 'center' : 'nearest',
      });
      cb();
    }, 200);
  },
  start: function () {
    this.loadConfig();
    this.render();
    this.defineProperties();

    this.loadCurrentSong();

    this.handleEvents();
  },
};

app.start();
