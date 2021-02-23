<template>
  <div
    class="loader"
    @change="change"
    @dragover="dragover"
    @drop="drop"
  >
    <p>
      Drop image here or
      <label class="browse">browse...
        <input
          id="file"
          class="sr-only"
          type="file"
          accept="image/*"
        >
      </label>
    </p>
  </div>
</template>

<script>
const URL = window.URL || window.webkitURL;

export default {
  name: 'Loader',

  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },

  methods: {
    read(files) {
      return new Promise((resolve, reject) => {
        if (!files || files.length === 0) {
          resolve();
          return;
        }

        const file = files[0];

        // skip over type change as some server will send image with other types.
        if (true || /^image\/\w+$/.test(file.type)) {
          if (URL) {
            resolve({
              loaded: true,
              name: file.name,
              type: file.type,
              url: URL.createObjectURL(file),
            });
          } else {
            reject(new Error('Your browser is not supported.'));
          }
        } else {
          reject(new Error('Please choose an image file.'));
        }
      });
    },

    change({ target }) {
      this.read(target.files).then((data) => {
        target.value = '';
        this.update(data);
      }).catch((e) => {
        target.value = '';
        this.alert(e);
      });
    },

    dragover(e) {
      e.preventDefault();
    },

    drop(e) {
      e.preventDefault();
      this.read(e.dataTransfer.files)
        .then((data) => {
          this.update(data);
        })
        .catch(this.alert);
    },

    alert(e) {
      window.alert(e && e.message ? e.message : e);
    },

    update(data) {
      Object.assign(this.data, data);
    },

    async loadImg(url) {
      let blob
      // support loading image via blob
      if (url instanceof File || url instanceof Blob) {
        blob = url;
      }
      else {
        blob = await fetch(url).then(r => r.blob());
        let name = url.slice(url.lastIndexOf('/') + 1).replace(/\?.*/i, '');
        blob.lastModifiedDate = new Date();
        blob.name = name || `${Date.now().toString()}.jpeg`;
      }
      this.read([blob]).then((data) => {
        this.update(data);
      }).catch((e) => {
        this.alert(e);
      });
    },

    getParameterByName(name, url = window.location.href) {
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },

    readMessage(evt) {
      var data = evt.data;
      switch (data.type) {
        case 'load:img-blob':
          this.loadImg(data.value.file);
          break;
      
        default:
          break;
      }
    }
  },

  mounted() {
    const url = this.getParameterByName('photo');
    url && this.loadImg(url);

    window.addEventListener('message', this.readMessage);
  },

  beforeDestroy() {
    // no need currently. as data:loaded will destroy `loader`.
    // window.removeEventListener('message', this.readMessage);
  }
};
</script>

<style scoped>
.loader {
  display: table;
  height: 100%;
  overflow: hidden;
  width: 100%;

  & > p {
    color: #999;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
  }
}

.browse {
  color: #0074d9;
  cursor: pointer;
  margin-left: .25rem;

  &:hover {
    color: #08f;
    text-decoration: underline;
  }
}
</style>
