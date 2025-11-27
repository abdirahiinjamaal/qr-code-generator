export interface GeneratorFormData {
    title: string
    description: string
    iosUrl: string
    androidUrl: string
    webUrl: string
    showIos: boolean
    showAndroid: boolean
    showWeb: boolean
    logoFile: File | null
    logoPreview: string | null
}

export interface GeneratorState {
    loading: boolean
    generatedLink: string | null
    qrValue: string | null
    activeSource: string | null
}
