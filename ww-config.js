export default {
    type: 'wwObject',
    options: {
        sizable: true,
        hyperlink: true,
    },
    editor: {
        label: {
            fr: 'Image',
            en: 'Image',
        },
        icon: 'assets',
    },
    properties: {
        url: {
            label: { en: 'Image', fr: 'Image' },
            type: 'Image',
            bindable: true,
            defaultValue: 'https://cdn.weweb.app/public/images/no_image_selected.png',
        },
        objectFit: {
            label: {
                en: 'Fit',
            },
            type: 'TextSelect',
            options: {
                options: [
                    { value: null, default: true, label: { en: 'Fill' } },
                    { value: 'cover', label: { en: 'Cover' } },
                    { value: 'contain', label: { en: 'Contain' } },
                ],
            },
            responsive: true,
            states: true,
            defaultValue: null,
        },
        overlay: {
            type: 'Color',
            label: { en: 'Overlay' },
            options: {
                nullable: true,
                gradient: true,
            },
            responsive: true,
            states: true,
            bindable: true,
        },
        filter: {
            type: 'CssFilters',
            label: { en: 'Filters' },
            responsive: true,
            states: true,
            bindable: true,
        },
        alt: {
            section: 'settings',
            label: { en: 'Alt', fr: 'Alt' },
            type: 'Text',
            multiLang: true,
            bindable: true,
            options: {
                placeholder: 'Image description',
            },
            defaultValue: { en: '' },
        },
        loading: {
            section: 'settings',
            label: { en: 'Loading' },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'lazy', label: { en: 'Lazy' }, default: true },
                    { value: 'eager', label: { en: 'Eager' } },
                ],
            },
            defaultValue: 'lazy',
        },
    },
};
