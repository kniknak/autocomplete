import React from 'react';
import {Autocomplete} from '../src/Autocomplete/Autocomplete';
import {fetchCountries} from '../src/Autocomplete/fetchCountries';

class App extends React.PureComponent {
    render() {
        return (
            <React.Fragment>
                <ol>
                    <li>✅ You cannot use any 3rd party libraries - only pure React and internal DOM functions</li>
                    <li>✅ The function to fetch data should be asynchronous. You can use mock data (such as a JSON array), but the function which uses it should be asynchronous (similar to a real REST call)</li>
                    <li>✅ It should have basic working CSS. No need for anything fancy (such as drop-shadows etc), but should look decent</li>
                    <li>You need to handle all non-standard use-cases - it should have a perfect user-experience</li>
                    <li>✅ Bonus points if you highlight the matching part of the text and not only showing it</li>
                    <li>✅ Should use plain JS, not TS</li>
                    <li>✅ No external state management libraries (refer to #1 as well), only native React methods</li>
                    <li>✅ Use only class components, feel free to use life-cycle methods if you need</li>
                    <li>✅ Shortcuts and hacks are perfectly ok - BUT you have to add comments on what are you doing there and why</li>
                </ol>
                <div style={{ width: 400, marginLeft: 40 }}>
                    <Autocomplete fetchOptions={fetchCountries} />
                </div>
            </React.Fragment>
        );
    }
}

export const Story = () => <App/>;

export default {
    title: 'Autocomplete',
    component: Story,
};
