# streamd
streamd is a hyper-fast and efficient screen share platform using peer-to-peer distributed screen sharing to connect people together without countless logins/accounts, extensions and external software.

As COVID-19 has split the physical world apart, sharing over the Internet has become a crucial element to staying connected with colleagues, family, and friends. Although screen sharing platforms have been available for public use for many years, those which are privacy-friendly and not reliant on having specific software and account creation remain unfulfilled.

Hence, we created streamd, a screen sharing application with a simple, minimalistic design for users to share screens with ease. 
The platform removes the inconveniences involved in current video connectivity platforms. The need for downloading a desktop application and login requirements are circumvented through our browser-based application. 
Furthermore, as streamd utilises a distributed, peer-to-peer, networking system, it is secure. The screen-shared media never touches our servers and is only shared between the host and their viewers. 

In addition, our peer-to-peer connection system undergoes optimisation routines involving speed tests and bottleneck paths (in relation to upload/download speeds). Our program finds the fastest and optimal connection between the viewers via representing a network as a weighted graph. Each node (computer/viewer) is considered as having an upload and download capacity, and nodes are able to utilise their capacity to support other viewers down the line. Representing the problem as a graph capacity network allows us to maximise speeds whilst minimising latency, ensuring a unique smooth peer-to-peer experience between screen-share host and viewers.
streamd was built utilising Rust for back-end, WebRTC for video capture & sharing, and HTML/CSS/JS for front-end user interface development. 
Due to centring around such a technical feature, the challenges were mainly involved in the implementation using WebRTC, async functions, streaming data, etc. to set up the functionality of screen sharing and streaming. Other challenges faced included working with HTML and CSS to ensure all elements were correctly positioned as well as issues with the presentation of UI elements.


[![Pitch](https://img.youtube.com/vi/GPoEpB1OyF4/0.jpg)](https://www.youtube.com/watch?v=GPoEpB1OyF4)
