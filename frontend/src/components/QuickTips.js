
const QuickTips = () => {
    return (
        <div>
            <p>The event are all there, it's just that some venues may have multiple events at it.</p>
            <p>Hey there! Just a quick heads up that some dates, times, and/or prices may not be available, especially for events farther out. We do our best to keep things current and accurate but if you notice any missing details, please double-check via the Purchase Tickets link provided. Stay safe and have fun!</p>
            <ul>
                <li>We'll ask for your current location to help you find fun events near you.</li>
                <li>If you don't want to give permission to use your current location, no problem! You can still use our map to find fun things to do. Just find a place you'd like to search for fun things to do, fill out as much information as you can in our search form, and search away! There's a little map scale at the bottom - click on it to toggle between miles and kilometers. Zoom in a bit on the place you'd like to search and try to place it as close the center of the map as you can - doesn't have to be exact. For a little extra help, place a value in the Distance input bar. It goes by miles (sorry Europe) and will search in a circle around the center of the map. Have fun!</li>
                <li>Dropped pin - try to drop pins where there are valid addresses. If you drop it somewhere and get an address that looks something like this: ABC123+AB12 (or something of that nature), that's called a Plus Code. These are part of a digital address system developed by Google to represent locations that do not have a specific street address - fun fact maybe? In any case, if you're trying to use a location like this as the origin of a direction route, it may not work - it should! But it might not...  </li>
            </ul>
        </div>
    )
};
            
export default QuickTips;