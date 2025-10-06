jQuery(document).ready(($) => {
  $("#a_adicionar").click(() => {
    console.log("save");
    $("#id_modal").modal("show");
  });

  $(document).on("click", "a[data-id]", function () {
    const id = this.dataset.id;
    const url = SolicitudesAjax.url;
    $.ajax({
      type: "POST",
      url: url,
      data: {
        action: "peticioneliminar",
        nonce: SolicitudesAjax.seguridad,
        id: id,
      },
      success: () => {
        alert("Datos borrados");
        location.reload();
      },
    });
  });
});
