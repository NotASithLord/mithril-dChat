(() => {
  "use strict";
  document.title = "D.chat";


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
          Chatbox: Chatbox,
          MessageComposer: MessageComposer
        })
      },
    })
  }

  function Layout() {
    const conversations = [];
    let searchResults = [];
    let showHamburger = false;

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
          messageQueue: [messageData]
        });
      }
      m.redraw();
    })

    return {
      view: (vnode) => [
        m("header", [
          m("div.headerWrap", [
            m("div.headerInfo", m("h1", "D.chat"), m('h2', m.route.param('conversation'))),
            m("div.hambSpace", [
              m("div.hamburger#hamburger", {
                onclick() {
                  showHamburger = !showHamburger;
                  this.classList.toggle("open");
                }
              }, [
                m("div.bar"),
                m("div.bar"),
                m("div.bar"),
                m("div.bar")
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
        ]), m("main", [
          m("section.sidePane", [
            // m("h2", "Your conversations"),
            m("form.searchBar", {
              oninput() {
                searchResults = searchInput(document.getElementById("searchInput").value, conversations);
              }
            }, [
              m("input.searchInput", {
                "autocomplete": "off",
                "id": "searchInput",
                "placeholder": " Search"
              }),
            ]),
            m("div#chatsPane", m(ChatPane, {
              searchResults: searchResults,
              conversations: conversations
            }))
          ]),
          m("section.outerChat", [
            m(".chatbox", {
              onupdate({dom}) {
                // console.log("chatbox change firing");
                dom.scrollTop = dom.scrollHeight;
              }
            }, vnode.attrs.Chatbox ? m(vnode.attrs.Chatbox, {conversations: conversations}) : vnode.attrs.homeMsg),
            vnode.attrs.MessageComposer ? m(vnode.attrs.MessageComposer, {conversations: conversations}) : undefined
          ])
        ])
      ],
    }
  }

  const HomeScreen = {
    view: () => {
      return m('h3.welcomeMsg', "Please select a conversation to get started");
    }
  }

  const Chatbox = {
    view: (vnode) => {
      const convo = currentConvo(vnode.attrs.conversations);
      convo.messageQueue.forEach(msg => msg.read = true);
      return convo.messageQueue.map((msg) => {
        return m('div.msgWrapper', m('div.msg', {
          class: msg.sender
        }, [
          m('div.msgHeader', [
            m('img', {
              src: msg.img
            }),
            m('p', msg.sender),
            m('p.time', msg.time),
          ]),
          m('div.msgContent', [
            m('p', msg.content),
          ]),
        ]))
      });
    }
  }

  function MessageComposer() {
    let userInput = "";
    return {
      view: (vnode) => {
        return m("form.messageComposer", {
          onsubmit(event) {
            event.preventDefault();
            sendMessage(userInput, currentConvo(vnode.attrs.conversations))
              .then((response) => {
                response.convo.messageQueue.push({
                  sender: "you",
                  content: response.userInput,
                  time: getTime(),
                  read: true,
                  img: "assets/vader.jpg"
                });
                m.redraw();
              })
              .catch((error) => {
                console.log("error", error);
              })
            userInput = "";
          }
        }, [
          m("div.accImgWrap", m("img.profileImg", {
            src: "assets/vader.jpg",
          })),
          m("input[autofocus].msgInput", {
            placeholder: "Your message here ...",
            value: userInput,
            oninput: (event) => {
              userInput = event.target.value
            },
          }),
          m("div.sendButton", [
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
      let paneContent = [];
      if (vnode.attrs.searchResults.length) {
        paneContent = vnode.attrs.searchResults;
        // console.log("first", array);
      } else {
        paneContent = vnode.attrs.conversations
        // console.log("hi", array);
      }
      return paneContent.map((convo) => {
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
            m('div.conversation', [
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

  function getTime() {
    const date = new Date();
    return date.getHours() + ":" + date.getMinutes();
  }

  function sendMessage(userInput, convo) {
    console.log("sending message to", convo);
    if (userInput && convo) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            userInput,
            convo
          })
        }, 100);
      });
    } //else return error, need input
  }

  function currentConvo(convos) {
    return convos.find((convo) => {
      return convo.convoName === m.route.param('conversation');
    });
  }

  function searchInput(searchTerm, array) {
    searchTerm = searchTerm.toLowerCase();
    const searchResults = [];

    if (searchTerm.length) {
      const reg = new RegExp(`\\b${searchTerm}\\b`);
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


})();