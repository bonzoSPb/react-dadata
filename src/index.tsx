import * as React from 'react';
import * as Highlighter from 'react-highlight-words';
import TextareaAutosize from 'react-textarea-autosize';
import './react-dadata.css';
declare module 'react' {
     interface InputHTMLAttributes<T> {
        validate?: (value: string) => void
    }
}
export namespace ReactDadata {
  export type DadataSuggestion = {
    value: string
    unrestricted_value: string
    data: DadataAddress
  }
  export type DadataAddress = {
    address: { value: string }
    area: string
    area_fias_id: string
    area_kladr_id: string
    area_type: string
    area_type_full: string
    area_with_type: string
    beltway_distance: null
    beltway_hit: null
    bic: string
    block: string
    block_type: string
    block_type_full: string
    capital_marker: "0" | "1" | "2" | "3" | "4"
    city: string
    city_area: string
    city_district: string
    city_district_fias_id: string
    city_district_kladr_id: string
    city_district_type: string
    city_district_type_full: string
    city_district_with_type: string
    city_fias_id: string
    city_kladr_id: string
    city_type: string
    city_type_full: string
    city_with_type: string
    country: string
    code: string
    correspondent_account: string
    fias_id: string
    fias_level: string
    flat: string
    flat_area: null
    flat_price: null
    flat_type: string
    flat_type_full: string
    geo_lat: string
    geo_lon: string
    history_values: string
    house: string
    house_fias_id: string
    house_kladr_id: string
    house_type: string
    house_type_full: string
    inn: string
    kladr_id: string
    kpp: string
    management: {
      name: string
      post: string
    }
    name: string
    ogrn: string
    okato: string
    oktmo: string
    postal_box: string
    postal_code: string
    qc: null
    qc_complete: null
    qc_geo: "0" | "1" | "2" | "3" | "4" | "5"
    qc_house: null
    region: string
    region_code: string
    region_fias_id: string
    region_kladr_id: string
    region_type: string
    region_type_full: string
    region_with_type: string
    settlement: string
    settlement_fias_id: string
    settlement_kladr_id: string
    settlement_type: string
    settlement_type_full: string
    settlement_with_type: string
    source: string
    square_meter_price: null
    street: string
    street_fias_id: string
    street_kladr_id: string
    street_type: string
    street_type_full: string
    street_with_type: string
    tax_office: string
    tax_office_legal: string
    type: "0" | "1" | "2" | "3"
    timezone: null
    unparsed_parts: null
  }
  export interface Props  {
    token: string
    placeholder?: string
    query?: string
    autoload?: boolean
    onChange?: (suggestion: DadataSuggestion) => void
    onFocus?: (suggestion: DadataSuggestion) => void
    onBlur?: (suggestion: DadataSuggestion) => void
    autocomplete?: string
    validate?: (value: string) => void
    bounds: string
    country: string
    name: string
    disabled: boolean
    readOnly: boolean
    autoFocus: boolean
    required: boolean
    className: string
    id: string
    suggestionType: string
  }

  export interface State {
    query: string
    inputQuery: string
    inputFocused: boolean
    suggestions: Array<DadataSuggestion>
    suggestionIndex: number
    suggestionsVisible: boolean
    isValid:boolean
  }
}

export class ReactDadata extends React.PureComponent<ReactDadata.Props, ReactDadata.State> {

  /**
   * HTML-input
   */
  protected textInput: HTMLInputElement;

  /**
   * XMLHttpRequest instance
   */
  protected xhr: XMLHttpRequest;

  constructor(props: ReactDadata.Props) {
    super(props);

    this.state = {
      query: this.props.query ? this.props.query : '',
      inputQuery: this.props.query ? this.props.query : '',
      inputFocused: false,
      suggestions: [],
      suggestionIndex: -1,
      suggestionsVisible: true,
      isValid: false
    }
  }

  componentDidMount() {
    if (this.props.autoload && this.state.query) {
      this.fetchSuggestions();
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      this.setState({ query: this.props.query ? this.props.query : '' });
    }
  }

  onInputFocus = (e) => {
    if (!this.props.readOnly) {
      this.setState({inputFocused: true});
      if (this.state.suggestions.length == 0) {
        this.fetchSuggestions();
      }
    }
    const { onFocus = () => {} } = this.props;
    onFocus(e);
  };

  onInputBlur = (e) => {
    this.setState({inputFocused: false});
    if (this.state.suggestions.length == 0) {
      this.fetchSuggestions();
    }
    const { onBlur = () => {} } = this.props;
    onBlur(e);
  };

  onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.setState({query: value, inputQuery: value, suggestionsVisible: true}, () => {
      if (this.props.validate){
        this.props.validate(value);
      };
      if (this.props.onChange) {
        this.props.onChange({
          value: value,
          unrestricted_value: '',
          data: {},
        } as ReactDadata.DadataSuggestion);
      }
      this.fetchSuggestions();
    });
  };

  onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.which == 40) {
      // Arrow down
      event.preventDefault();
      if (this.state.suggestionIndex < this.state.suggestions.length) {
        const newSuggestionIndex = this.state.suggestionIndex + 1;
        const newInputQuery = this.state.suggestions[newSuggestionIndex].value;
        this.setState({suggestionIndex: newSuggestionIndex, query: newInputQuery})
      }
    } else if (event.which == 38) {
      // Arrow up
      event.preventDefault();
      if (this.state.suggestionIndex >= 0) {
        const newSuggestionIndex = this.state.suggestionIndex - 1;
        const newInputQuery = newSuggestionIndex == -1 ? this.state.inputQuery : this.state.suggestions[newSuggestionIndex].value;
        this.setState({suggestionIndex: newSuggestionIndex, query: newInputQuery})
      }
    } else if (event.which == 13) {
      // Enter
      event.preventDefault();
      if (this.state.suggestionIndex >= 0) {
        this.selectSuggestion(this.state.suggestionIndex);
      }
    }
  };

  fetchSuggestions = () => {
    if (this.xhr) {
      this.xhr.abort();
    }
    this.xhr = new XMLHttpRequest();
    let url;
    let params;
    if (this.props.suggestionType === 'bank') {
      url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/bank";
      params = {
        query: this.state.query,
      };
    } else if (this.props.suggestionType === 'fms') {
      url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fms_unit";
      params = {
        query: this.state.query,
      };
    } else if (this.props.suggestionType === 'party') {
      url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
      params = {
        query: this.state.query,
      };
    } else {
      url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address?5";
      params = {
        query: this.state.query,
        count: 10,
        to_bound: {
          value: this.props.bounds,
        },
        from_bound: {
          value: this.props.bounds,
        },
        locations: [{
          country: this.props.country,
        }],
      };
    }
    this.xhr.open("POST", url);
    this.xhr.setRequestHeader("Accept", "application/json");
    this.xhr.setRequestHeader("Authorization", `Token ${this.props.token}`);
    this.xhr.setRequestHeader("Content-Type", "application/json");
    this.xhr.send(JSON.stringify(params));

    this.xhr.onreadystatechange = () => {
      if (this.xhr.readyState != 4) {
        return;
      }

      if (this.xhr.status == 200) {
        const responseJson = JSON.parse(this.xhr.response);
        if (responseJson && responseJson.suggestions) {
          this.setState({suggestions: responseJson.suggestions, suggestionIndex: -1});
        }
      }
    };
  };

  onSuggestionClick = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    this.selectSuggestion(index);
  };

  onSuggestionTouch = (index: number, event: React.TouchEvent<HTMLDivElement>) => {
    event.stopPropagation();
    this.selectSuggestion(index);
  };

  selectSuggestion = (index: number) => {
    if (this.state.suggestions.length >= index - 1) {
      this.setState({query: this.state.suggestions[index].value, suggestionsVisible: false, inputQuery: this.state.suggestions[index].value}, () => {
        this.fetchSuggestions();
        setTimeout(() => this.setCursorToEnd(this.textInput), 100);
      });

      if (this.props.onChange) {
        this.props.onChange(this.state.suggestions[index]);
      }
    }
  };

  setCursorToEnd = (element) => {
    const valueLength = element.value.length;
    if (element.selectionStart || element.selectionStart == '0') {
      // Firefox/Chrome
      element.selectionStart = valueLength;
      element.selectionEnd = valueLength;
      element.focus();
    }
  };

  getHighlightWords = (): Array<string> => {
    const wordsToPass = ['г', 'респ', 'ул', 'р-н', 'село', 'деревня', 'поселок', 'пр-д', 'пл', 'к', 'кв', 'обл', 'д'];
    let words = this.state.inputQuery.replace(',', '').split(' ');
    words = words.filter((word) => {
      return wordsToPass.indexOf(word) < 0;
    });
    return words;
  };

  render() {
    return (
      <div className="react-dadata react-dadata__container">
        <div>
          <TextareaAutosize
              className={`react-dadata__input ${this.props.className}`}
              placeholder={this.props.placeholder ? this.props.placeholder : ''}
              value={this.state.query}
              id={this.props.id}
              ref={ (input) => { this.textInput = input as HTMLInputElement; } }
              onChange={this.onInputChange}
              onKeyPress={this.onKeyPress}
              onKeyDown={this.onKeyPress}
              onFocus={this.onInputFocus}
              onBlur={this.onInputBlur}
              autoFocus={this.props.autoFocus}
              validate={this.props.validate}
              autoComplete={this.props.autocomplete ? this.props.autocomplete : 'off'}
              name={this.props.name}
              disabled={this.props.disabled}
              required={this.props.required}
              readOnly={this.props.readOnly}
          />
        </div>
        {this.state.inputFocused && this.state.suggestionsVisible && this.state.suggestions && this.state.suggestions.length > 0 && <div className="react-dadata__suggestions">
          <div className="react-dadata__suggestion-note">Выберите вариант или продолжите ввод</div>
          {this.state.suggestions.map((suggestion, index) => {
            let suggestionClass = 'react-dadata__suggestion';
            if (index == this.state.suggestionIndex) {
              suggestionClass += ' react-dadata__suggestion--current';
            }
            if (this.props.suggestionType === 'bank') {
              return <div key={suggestion.data.bic} onTouchStart={this.onSuggestionTouch.bind(this, index)}onMouseDown={this.onSuggestionClick.bind(this, index)} className={suggestionClass}><Highlighter highlightClassName="react-dadata--highlighted" autoEscape={true} searchWords={this.getHighlightWords()} textToHighlight={suggestion.value}/><div className="react-dadata__suggestion__subtext"><Highlighter highlightClassName="react-dadata--highlighted" autoEscape={true} searchWords={this.getHighlightWords()} textToHighlight={suggestion.data.bic}/> <Highlighter highlightClassName="react-dadata--highlighted" autoEscape={true} searchWords={this.getHighlightWords()} textToHighlight={suggestion.data.address.value}/></div></div>
            } else if (this.props.suggestionType === 'party') {
              return <div key={suggestion.data.inn} onTouchStart={this.onSuggestionTouch.bind(this, index)} onMouseDown={this.onSuggestionClick.bind(this, index)} className={suggestionClass}><Highlighter highlightClassName="react-dadata--highlighted" autoEscape={true} searchWords={this.getHighlightWords()} textToHighlight={suggestion.value}/><div className="react-dadata__suggestion__subtext"><Highlighter highlightClassName="react-dadata--highlighted" autoEscape={true} searchWords={this.getHighlightWords()} textToHighlight={suggestion.data.inn}/> <Highlighter highlightClassName="react-dadata--highlighted" autoEscape={true} searchWords={this.getHighlightWords()} textToHighlight={suggestion.data.address.value}/></div></div>
            } else if (this.props.suggestionType === 'fms') {
              return <div key={`${suggestion.value}${suggestion.data.code}`} onTouchStart={this.onSuggestionTouch.bind(this, index)} onMouseDown={this.onSuggestionClick.bind(this, index)} className={suggestionClass}><Highlighter highlightClassName="react-dadata--highlighted" autoEscape={true} searchWords={this.getHighlightWords()} textToHighlight={suggestion.value}/></div>
            } else {
              return <div key={suggestion.value} onTouchStart={this.onSuggestionTouch.bind(this, index)} onMouseDown={this.onSuggestionClick.bind(this, index)} className={suggestionClass}><Highlighter highlightClassName="react-dadata--highlighted" autoEscape={true} searchWords={this.getHighlightWords()} textToHighlight={suggestion.value}/></div>
            }
          })}
        </div>}
      </div>
    );
  }
}
