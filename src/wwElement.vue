<template>
    <div class="ww-image-basic" ww-responsive="ww-image-basic" :style="style">
        <div class="ww-image-basic-overlay"></div>
        <img :src="src" :srcset="srcset.join(',')" :alt="alt" />
    </div>
</template>

<script>
export default {
    inject: {
        getObjectStyle: { default: () => {} },
    },
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
        wwFrontState: { type: Object, required: true },
        /* wwManager:start */
        wwEditorState: { type: Object, required: true },
        /* wwManager:end */
    },
    emits: ['update:content'],
    data() {
        return {
            srcset: [],
        };
    },
    computed: {
        isPrerender() {
            return window.__WW_IS_PRERENDER__;
        },
        screenSize() {
            return this.$store.getters['front/getScreenSize'];
        },
        screenSizes() {
            return this.$store.getters['front/getScreenSizes'];
        },

        /* URL */
        url() {
            const url = this.wwElementState.props.url || this.content.url || '';
            return typeof url === 'string' ? url : '';
        },
        isWeWeb() {
            return this.url.startsWith('designs/');
        },
        src() {
            return this.isWeWeb ? `${wwLib.wwUtils.getCdnPrefix()}${this.url}` : this.url;
        },

        /* STYLE */
        aspectRatio() {
            const elementHeight = this.getObjectStyle().height;
            if (elementHeight && elementHeight.endsWith('%')) {
                return `100 / ${elementHeight.replace('%', '')}`;
            } else {
                return 'unset';
            }
        },
        style() {
            return {
                '--wwi-ar': this.aspectRatio,
                '--wwi-of': this.content.objectFit,
                '--wwi-f': this.content.filter,
                '--wwi-o': this.content.overlay,
            };
        },

        /* ALT */
        alt() {
            return wwLib.wwLang.getText(this.content.alt);
        },
    },
    watch: {
        /* wwFront:start */
        screenSize(newValue, oldValue) {
            if (oldValue != newValue) {
                this.setSrcset();
            }
        },
        /* wwFront:end */
    },
    mounted() {
        /* wwFront:start */
        this.setSrcset();
        /* wwFront:end */
    },
    methods: {
        getTwicPicsUrl(size) {
            if (!this.isWeWeb) return this.url;

            return `${wwLib.wwUtils.transformToTwicPics(this.url, 'weweb')}/quality=90/resize=${size}`;
        },
        setSrcset() {
            const img = this.$el.querySelector('img');
            let width = Math.round(img.getBoundingClientRect().width);

            const transform = wwLib.getResponsiveStyleProp({
                uid: this.wwElementState.uid,
                states: [':anim'],
                prop: 'transform',
            });
            if (transform && transform.scale) {
                const scaleX = parseFloat(transform.scale.x);
                if (scaleX !== 0) width = width / scaleX;
                else {
                    width = 1200;
                }
            }

            if (width) {
                const url = `${this.getTwicPicsUrl(width)} ${width}w`;
                if (this.srcset.indexOf(url) === -1) {
                    this.srcset.push(url);

                    console.log(this.srcset);
                }
            }
        },
    },
};
</script>

<style scoped lang="scss">
.ww-image-basic {
    position: relative;
    isolation: isolate;

    &-overlay {
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--wwi-o);
        pointer-events: none;
    }

    & img {
        z-index: 0;
        width: 100%;
        height: 100%;
        display: block;
        aspect-ratio: var(--wwi-ar);
        object-fit: var(--wwi-of);
        filter: var(--wwi-f);
    }
}

/* wwEditor:start */
.ww-image-basic {
    & img {
        pointer-events: none;
    }
}
/* wwEditor:end */
</style>

