
/** Disclaimer, quick tips, and information that may make the user's life a little easier. */

const QuickTips = () => {
    return (
        <div className="QuickTips">
            <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <h2 className="heading-text">A Few Things Worth Mentioning...</h2>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-subtitle mb-2 text-muted">Disclaimer:</h5>
                        <p>Some dates, times, locations and/or prices for events may not be available - especially if an event date is farther out. We strive to keep information accurate, but please double-check everything and take a look at the Purchase Tickets link on the map page. Stay safe and have fun!</p>
                        <hr/>
                        <h5 className="card-subtitle mb-2 text-muted">Quick Tips:</h5>
                        <ul>
                            <li>We'll ask for your location to help find nearby events. If you prefer not to share, you can still use the map to search for fun activities.</li>
                            <li>To search without using your location:
                                <ul>
                                    <li>Use the map to find an area you want to explore.</li>
                                    <li>Drop a pin on the map - this is like a custom origin pin instead of your location.</li>
                                    <li>Fill out the form and search away!</li>
                                </ul>
                            </li>
                        </ul>
                        <hr />
                        <h5 className="card-subtitle mb-2 text-muted">Other Pro Tips:</h5>
                        <ul className="mb-0">
                            <li>The Distance searched is in a radius around either your location, a dropped pin, or around the center point of wherever the map is (no pin required).</li>
                            <li>The Distance search is measured in miles - sorry Europe.</li>
                            <li>We included a little scale at the bottom to help with distances - click on it to switch between miles and kilometers.</li>
                            <li>If you drop a pin, try to do so where there are valid addresses. Pins may show a Plus Code (e.g., ABC123+AB12) which is a digital address by Google for places without street addresses. These may not always work for directions, but they usually do.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickTips;