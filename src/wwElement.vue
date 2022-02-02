<template>
    <div class="ww-image-basic" ww-responsive="ww-image-basic" :style="style">
        <div class="ww-image-basic-overlay"></div>
        <img :src="src" :srcset="srcset" :sizes="sizes" :alt="alt" loading="lazy" />
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
    },
    emits: ['update:content'],
    data() {
        return {
            srcsetSizes: [50, 100, 200, 400, 800, 1200, 1600, 2000, 2600, 3000],
            sizes: [0, 0, 0],
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
        srcset() {
            /* wwFront:start */
            if (this.isWeWeb) {
                const srcset = [];
                for (const srcsetSize of this.srcsetSizes) {
                    srcset.push(`${this.getTwicPicsUrl(srcsetSize)} ${srcsetSize}w`);
                }

                return srcset.join(',');
            }
            /* wwFront:end */
            return null;
        },
        sizes() {
            /* wwFront:start */
            if (this.isWeWeb) {
                const screens = ['mobile', 'tablet', 'default'];
                const sizes = [];
                for (const screen of screens) {
                    const index = this.screenSizes[screen].order;
                    if (this.sizes[index]) {
                        const query = this.screenSizes[screen].query;
                        if (query) sizes.push(`(${this.screenSizes[screen].query}) ${this.sizes[index]}vw`);
                        else sizes.push(`${this.sizes[index]}vw`);
                    }
                }
                return sizes.join(', ');
            }
            /* wwFront:end */
            return null;
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
                setTimeout(this.setSizes, 1000);
            }
        },
        /* wwFront:end */
    },
    mounted() {
        /* wwFront:start */
        if (!this.isPrerender && this.$el) {
            const _sizes = this.$el.getAttribute('sizes');
            if (_sizes) this.sizes = JSON.parse(_sizes);
        } else {
            setTimeout(this.setSizes, 1000);
        }
        /* wwFront:end */
    },
    methods: {
        getTwicPicsUrl(size) {
            if (!this.isWeWeb) return this.url;

            return `${wwLib.wwUtils.transformToTwicPics(this.url, 'weweb')}/quality=90/resize=${size}`;
        },
        setSizes() {
            if (!this.isPrerender) return;

            let width = Math.round(this.$el.getBoundingClientRect().width);
            console.log(this.$el, this.$el.getBoundingClientRect().width);

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
                this.sizes[this.screenSizes[this.screenSize].order] = Math.ceil((width * 100) / window.innerWidth);
                this.$el.setAttribute('sizes', JSON.stringify(this.sizes));
                console.log(this.sizes);
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
        user-select: none;
    }
}
/* wwEditor:end */
</style>

