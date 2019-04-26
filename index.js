(() => {
"use strict";
document.title = "D.chat";

const conversations = [];

function getTime() {
    const date = new Date();
    return date.getHours() + ":" + date.getMinutes();
}

function sendMessage(userInput) {
  console.log("current convo", currentConvo());
    if (userInput) {
        currentConvo().messageQueue.push({
            sender: "you",
            content: userInput,
            time: getTime(),
            read: true,
            img: "assets/vader.jpg"
        });
    }
    //why?
    return true;
}

function currentConvo() {
  console.log("convo bug", conversations, conversations[0]);
  console.log("convo param", m.route.param('conversation'));
  console.log(
    conversations.find((convo) => {
        return convo.convoName === m.route.param('conversation');
    })
  )
    return conversations.find((convo) => {
      // console.log(convo, convo.sender === m.route.param('conversation'));
        return convo.convoName === m.route.param('conversation');
    });
}

function searchInput(searchTerm, array) {
    searchTerm = searchTerm.toLowerCase();
    const searchResults = [];

    if (searchTerm.length) {
        let reg = new RegExp(`\\b${searchTerm}\\b`);
        conversations.forEach((convo) => {
            let match = false;
            // console.log(convo.sender.toLowerCase(), reg.test(convo.sender.toLowerCase()))
            if (reg.test(convo.convoName.toLowerCase())) {
                match = true;
            }
            convo.messageQueue.forEach((msg) => {
                // console.log(msg.content.toLowerCase(), reg.test(msg.content.toLowerCase()))
                if (reg.test(msg.content.toLowerCase())) {
                    match = true;
                }
            })
            if (match) {
                // console.log(convo);
                searchResults.push(convo);
                // console.log(searchResults);
            }
        });
    }
    return searchResults;
}

const HomeScreen = {
    view: () => {
        return m('h3.welcomeMsg',"Please select a conversation to get started");
    }
}

const Chatbox = {
    view: () => {
        const convo = currentConvo();
        console.log(convo);
        convo.messageQueue.forEach(msg => msg.read = true);
        return convo.messageQueue.map((msg) => {
            return m('.msgWrapper', m('.msg', {
                class: msg.sender
            }, [
                m('.msgHeader', [
                    m('img', {
                        src: msg.img
                    }),
                    m('p', msg.sender),
                    m('p.time', msg.time),
                ]),
                m('.msgContent', [
                    m('p', msg.content),
                ]),
            ]))
        });
    }
}

function MessageComposer() {
    let userInput = "";
    return {
        view: () => {
            return m("form.myMsg", {
                onsubmit(e) {
                  e.preventDefault();
                  console.log("submit", userInput);
                  console.log("teeest");
                  sendMessage(userInput);
                  userInput = "";
                }
            }, [
                m(".accImgWrap", m("img.homeAccImg", {
                    src: "assets/vader.jpg",
                })),
                m("input[autofocus].homeMsgArea", {
                    placeholder: "Your message here ...",
                    value: userInput,
                    oninput: (ev) => {
                        // console.log(ev.target.value);
                        userInput = ev.target.value
                    },
                }),
                m(".sendButton", [
                    m("input[type=submit]#submit", {
                        value: "Send"
                    }),
                ]),
            ]);
        }
    }
}

const ChatPane = {
    view: (vnode) => {
        let array = [];
        if (vnode.attrs.searchResults.length) {
            array = vnode.attrs.searchResults;
            // console.log("first", array);
        } else {
            array = conversations;
            // console.log("hi", array);
        }
        return array.map((convo) => {
            const preview = convo.messageQueue[convo.messageQueue.length - 1];
            let unread = 0;
            convo.messageQueue.forEach((msg) => {
                if (msg.read === false) unread++;
            })
            return m('a', {
              href: `/${convo.convoName}`,
              oncreate: m.route.link
            }, [
              m('div.convoWrapper', [
                m('div.conversation', {
                    onclick() {}
                }, [
                        m('img', {
                            src: convo.img
                        }),
                        m('h3', convo.convoName),
                        m('span.previewWrap', [
                            m('p', preview.content)
                        ]),
                        m('span.unread', unread)
                ])
            ])
          ])
        })
    }
}

function Layout() {
    let showHamburger = false;
    let searchResults = [];

    //This takes the subscription data from window.connect in backend.js, and does the logic to push the formatted incomingMessages into the conversations array
    connect(messageData => {
        // console.log("connect is running");
        const convo = conversations.find(convo => convo.convoName === messageData.sender);
        if (convo != null) {
            convo.messageQueue.push(messageData);
        } else {
            conversations.push({
                convoName: messageData.sender,
                img: messageData.img,
                messageQueue: [messageData],
                read: messageData.read
            });
        }
        m.redraw();
    })

    return {
        view: (vnode) => [
            m("header", [
                m(".headerWrap", [
                m(".headerInfo", m("h1", "D.chat"), m('h2', m.route.param('conversation'))),
                m(".hambSpace", [
                    m(".hamburger#hamburger", {
                        onclick() {
                            showHamburger = !showHamburger;
                            this.classList.toggle("open");
                        }
                    }, [
                        m(".bar"),
                        m(".bar"),
                        m(".bar"),
                        m(".bar")
                    ]),
                    m("div.dropdown-content", {
                        style: {
                            display: showHamburger ? "block" : "none"
                        },
                    }, [
                        m("a[href=#home]", "Home"),
                        m("a[href=#newgroup]", "New Group"),
                        m("a[href=#contacts]", "Contacts"),
                        m("a[href=#settings]", "Settings"),
                        m("a[href=#faq]", "FAQs"),
                    ])
                ]),
              ])
            ]),m("main", [
            m("section.sidePane", [
                // m("h2", "Your conversations"),
                m("form.searchBar", {
                    oninput() {
                        searchResults = searchInput(document.getElementById("searchInput").value, conversations);
                    }
                }, [
                    m("input.searchInput", {
                        "autocomplete":"off",
                        "id": "searchInput",
                        "placeholder": " Search"
                    }),
                ]),
                m("#chatsPane", m(ChatPane, {
                    searchResults: searchResults
                }))
            ]),
            m("section.outerChat", [
                m(".chatbox", {
                    onupdate({dom}) {
                      // console.log("chatbox change firing");
                        dom.scrollTop = dom.scrollHeight;
                    }
                }, vnode.attrs.messages, vnode.attrs.homeMsg),
                vnode.attrs.composer
            ])
            ])
        ],
    }
}

//NOTE:Not as fast as jquery onload, since it waits for external assets not just DOM. Find suitable vanilla replacement
//Only include UI interactivity within here, all other logic can start loading before DOM is ready
window.onload = () => {
    // console.log(document.body);
    m.route(document.body, "/", {
        "/": {
            render: () => m(Layout, {
                homeMsg: m(HomeScreen)
            })
        },
        "/:conversation": {
            render: () => m(Layout, {
                messages: m(Chatbox),
                composer: m(MessageComposer)
            })
        },
    })
}

})()