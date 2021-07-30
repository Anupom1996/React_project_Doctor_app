import swal from "sweetalert";

export function showErrorMessage(err, props){
  var errText = '';
  if(localStorage.getItem('admin_token')){
    errText = JSON.stringify(err.data.message);
  }else{
    errText = err.data.message;
  }
  swal({
    closeOnClickOutside: false,
    title: "Error",
    text: errText,
    icon: "error"
  }).then(()=> {      
      if(localStorage.getItem('admin_token')){
        if(err.data.status === 5){
          localStorage.removeItem('admin_token')
        }
        //props.history.push('/admin');
        window.location.href="/";
      }else{
        //props.history.push('/');
        window.location.href="/";
      }
    });

}

