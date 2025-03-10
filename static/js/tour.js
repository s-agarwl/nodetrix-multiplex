 function tour(){
 var hideBtns = function(){
        // console.log("inside hide buttons");
            $("div.btn-group").hide();
        };

      window.localStorage.removeItem("tour_end");
    window.tour = new Tour({
        backdrop: false,
          steps: [
          {
            element: "#menu-toggle",
            title: "Context Operations Menu",
            content: "Click this button  to open the menu for context operations (from left edge of screen).",
            // next:-1,
            reflex:true,
            onShown: function (tour) {
                        hideBtns();
                        // console.log(tour.getCurrentStep());
                    }
          },
          {
            element: "#color-button",
            title: "Changing color for every matrix/aggregated node",
            content: "Click to see various color combinations.",
            reflex: true,
            onShown: function (tour) {
                        hideBtns();

                    }

          },
           {
            element: "#ui-id-2",
            title: "Select Orange-Green color",
            content: "Select Orange-Green color to reflect in every matrix.",
            reflex: true,
            onShown: function (tour) {
                        hideBtns();

                    }

          },
          {
            element: "#menu-toggle",
            title: "Context Operations Menu",
            content: "Click this button  to close the menu for context operations.",
            // next:-1,
            reflex:true,
            onShown: function (tour) {
                        hideBtns();
                        // console.log(tour.getCurrentStep());
                    }
          },
          {
            element: "#matrix0",
            title: "Focus Operations Menu",
            content: "Right clicking on a matrix/aggregated node/focus opens Focus Operations Menu (from right edge fo screen).",
            reflex:true,
            onShown: function (tour) {
                        hideBtns();

                    }
          },
          {
            element: "#test2",
            title: "Focus operations Menu",
            content: "Various operations which will only be performed on selected focus.",
            // reflex: true,
            placement:'left',
            onShown: function (tour) {
                        // hideBtns();

                    }

          },
           {
            element: "#sidebar-download",
            title: "Image of Focus",
            content: "Downloads the image of selected focus and also adds the focus image to Staging Area.",
            // reflex: true,
           placement:'left'

          }
          ,
           {
            element: "#sidebar-similarity-button",
            title: "Alternate similarity matrix layer",
            content: "Select alternate similarity matrix layer from the list.",
            // reflex: true,
           placement:'left'

          }
          ,
           {
            element: "#layer3edge_focus",
            title: "Author-topic intra-community edges",
            content: "Show intra-community edges of author-topic similarity layer emerging from selected focus.",
            // reflex: true,
            // backdrop:true,
            // backdropPadding:5,
           placement:'left'

          }
          ,
           {
            element: "#sidebar-matrix-button",
            title: "Focus Operations",
            content: "Various seriation and other operations for selected focus.",
            // reflex: true,
           placement:'left'

          }
          ,
           {
            element: "#state",
            title: "Freeze the focus",
            content: "Check this to freeze the selected focus from any context operation. After checking it, the focus will not be affected by any operation performed through context operations menu.",
            // reflex: true,
            // backdrop:true,
            // backdropPadding:5,

           placement:'left'

          }
          ,
           {
            element: "#historydiv",
            title: "Action history area",
            content: "This space showcases the history of actions performed on the selected focus.",
            // reflex: true,
           placement:'left'

          }
          // ,
          //  {
          //   element: "#stagingAreatext",
          //   title: "Staging Area",
          //   content: "This space contains all the focus images added through downloaded through focus operations menu.",
          //   // reflex: true,
          //  placement:'top'

          // }
        ]}); }
  