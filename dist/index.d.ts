/// <reference types="react" />
import * as React from 'react';
import './react-dadata.css';
declare module 'react' {
    interface InputHTMLAttributes<T> {
        validate?: (value: string) => void;
    }
}
export declare namespace ReactDadata {
    type DadataSuggestion = {
        value: string;
        unrestricted_value: string;
        data: DadataAddress;
    };
    type DadataAddress = {
        address: {
            value: string;
        };
        area: string;
        area_fias_id: string;
        area_kladr_id: string;
        area_type: string;
        area_type_full: string;
        area_with_type: string;
        beltway_distance: null;
        beltway_hit: null;
        bic: string;
        block: string;
        block_type: string;
        block_type_full: string;
        capital_marker: "0" | "1" | "2" | "3" | "4";
        city: string;
        city_area: string;
        city_district: string;
        city_district_fias_id: string;
        city_district_kladr_id: string;
        city_district_type: string;
        city_district_type_full: string;
        city_district_with_type: string;
        city_fias_id: string;
        city_kladr_id: string;
        city_type: string;
        city_type_full: string;
        city_with_type: string;
        country: string;
        code: string;
        correspondent_account: string;
        fias_id: string;
        fias_level: string;
        flat: string;
        flat_area: null;
        flat_price: null;
        flat_type: string;
        flat_type_full: string;
        geo_lat: string;
        geo_lon: string;
        history_values: string;
        house: string;
        house_fias_id: string;
        house_kladr_id: string;
        house_type: string;
        house_type_full: string;
        inn: string;
        kladr_id: string;
        kpp: string;
        management: {
            name: string;
            post: string;
        };
        name: string;
        ogrn: string;
        okato: string;
        oktmo: string;
        postal_box: string;
        postal_code: string;
        qc: null;
        qc_complete: null;
        qc_geo: "0" | "1" | "2" | "3" | "4" | "5";
        qc_house: null;
        region: string;
        region_code: string;
        region_fias_id: string;
        region_kladr_id: string;
        region_type: string;
        region_type_full: string;
        region_with_type: string;
        settlement: string;
        settlement_fias_id: string;
        settlement_kladr_id: string;
        settlement_type: string;
        settlement_type_full: string;
        settlement_with_type: string;
        source: string;
        square_meter_price: null;
        street: string;
        street_fias_id: string;
        street_kladr_id: string;
        street_type: string;
        street_type_full: string;
        street_with_type: string;
        tax_office: string;
        tax_office_legal: string;
        type: "0" | "1" | "2" | "3";
        timezone: null;
        unparsed_parts: null;
    };
    interface Props {
        token: string;
        placeholder?: string;
        query?: string;
        autoload?: boolean;
        onChange?: (suggestion: DadataSuggestion) => void;
        onFocus?: (suggestion: DadataSuggestion) => void;
        onBlur?: (suggestion: DadataSuggestion) => void;
        autocomplete?: string;
        validate?: (value: string) => void;
        bounds: string;
        parts?: [string];
        country: string;
        translate?: boolean;
        firstCapital?: boolean;
        name: string;
        disabled: boolean;
        readOnly: boolean;
        autoFocus: boolean;
        required: boolean;
        className: string;
        id: string;
        suggestionType: string;
    }
    interface State {
        query: string;
        inputQuery: string;
        inputFocused: boolean;
        inputBlur: boolean;
        suggestions: Array<DadataSuggestion>;
        suggestionIndex: number;
        suggestionsVisible: boolean;
        isValid: boolean;
    }
}
export declare class ReactDadata extends React.PureComponent<ReactDadata.Props, ReactDadata.State> {
    /**
     * HTML-input
     */
    protected textInput: HTMLInputElement;
    /**
     * XMLHttpRequest instance
     */
    protected xhr: XMLHttpRequest;
    constructor(props: ReactDadata.Props);
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    onInputFocus: (e: any) => void;
    onInputBlur: (e: any) => void;
    switchLanguage: (string: any) => any;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    fetchSuggestions: () => void;
    onSuggestionClick: (index: number, event: React.MouseEvent<HTMLDivElement>) => void;
    onSuggestionTouch: (index: number, event: React.TouchEvent<HTMLDivElement>) => void;
    selectSuggestion: (index: number, skipSetCursorFlag?: boolean | undefined) => void;
    setCursorToEnd: (element: any) => void;
    getHighlightWords: () => string[];
    render(): JSX.Element;
}
