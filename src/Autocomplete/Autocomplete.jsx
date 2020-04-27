import * as React from "react";
import * as classnames from "classnames";
import * as styles from "./Autocomplete.scss";

const keyCode = {
    arrowDown: 40,
    arrowUp: 38,
    enter: 13,
};

class Option extends React.PureComponent {
    ref = React.createRef();

    componentDidUpdate({ isActive, scrollDirection }) {
        if (!isActive && this.props.isActive && this.ref.current) {
            this.ref.current.scrollIntoView({
                block: "nearest",
                inline: scrollDirection === "top" ? "start" : "end",
            });
        }
    }

    onSelect = () => this.props.onSelect(this.props.index);

    render() {
        const {
            isActive,
            highlight,
            option,
        } = this.props;

        const value = option.replace(
            new RegExp(highlight, "gi"),
            fragment => `<span class=${styles.highlighted}>${fragment}</span>`,
        );

        return (
            <li
                ref={this.ref}
                className={classnames(styles.option, isActive && styles.optionActive)}
                onClick={this.onSelect} dangerouslySetInnerHTML={{__html: value}}
            />
        );
    }
}

export class Autocomplete extends React.PureComponent {
    input = React.createRef();
    dropdown = React.createRef();
    state = {
        activeOption: 0,
        options: [],
        showDropdown: false,
        value: "",
        isLoading: false,
        scrollDirection: "bottom",
    };

    componentDidMount() {
        window.addEventListener("mousedown", this.onClickOutside);
    }

    componentWillUnmount() {
        window.removeEventListener("mousedown", this.onClickOutside);
    }

    onClickOutside = event => {
        if (!this.state.showDropdown || !this.input.current || !this.dropdown.current) {
            return;
        }

        if (!this.input.current.contains(event.target) && !this.dropdown.current.contains(event.target)) {
            this.setState({showDropdown: false});
        }
    };

    onChange = event => {
        const value = event.target.value;

        if (value.length < 2) {
           return this.setState({ value });
        }

        this.setState({
            value,
            isLoading: true,
        });
        this.props.fetchOptions({
            value: value.trim(),
            onSuccess: options => this.setState({
                activeOption: 0,
                options,
                showDropdown: true,
                isLoading: false,
            }),
        });
    };

    onSelect = activeOption => this.setState({
        activeOption,
        showDropdown: false,
        value: this.state.options[activeOption],
    });

    onClick = () => this.setState({
        showDropdown: !this.state.showDropdown,
    });

    onKeyDown = event => {
        const { activeOption, options, showDropdown } = this.state;

        if (!options || !options.length) {
            return;
        }

        switch (event.keyCode) {
            case keyCode.enter:
                if (!showDropdown) {
                    return;
                }
                event.preventDefault();
                return this.setState({
                    activeOption: 0,
                    showDropdown: false,
                    value: options[activeOption],
                });
            case keyCode.arrowUp:
                if (activeOption === 0) {
                    return;
                }

                event.preventDefault();
                return this.setState({
                    activeOption: activeOption - 1,
                    scrollDirection: "top",
                });
            case keyCode.arrowDown:
                if (activeOption === options.length - 1) {
                    return;
                }

                event.preventDefault();
                return this.setState({
                    activeOption: activeOption + 1,
                    scrollDirection: "bottom",
                });
        }
    };

    render() {
        const {
            activeOption,
            options,
            showDropdown,
            value,
            isLoading,
            scrollDirection,
        } = this.state;

        const notLoading = !isLoading && showDropdown && (value.length >= 2);
        const hasDropdown = notLoading && !!options.length;
        const noResults = notLoading && !options.length;
        const highlight = value.trim();

        return (
            <React.Fragment>
                <input
                    ref={this.input}
                    type="text"
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    value={value}
                    onClick={this.onClick}
                    className={classnames(styles.input, hasDropdown && styles.inputActive)}
                />
                {hasDropdown && (
                    <ul ref={this.dropdown} className={styles.options}>
                        {options.map((option, index) => (
                            <Option
                                key={index}
                                isActive={activeOption === index}
                                highlight={highlight}
                                option={option}
                                onSelect={this.onSelect}
                                index={index}
                                scrollDirection={(activeOption === index) && scrollDirection}
                            />
                        ))}
                    </ul>
                )}
                {noResults && <div className={styles.noResults}>Nothing found</div>}
                {isLoading && <div className={styles.noResults}>Loading results...</div>}
            </React.Fragment>
        );
    }
}