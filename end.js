function handleClick(event) {
  if (event.target instanceof HTMLAnchorElement) {
    var redirectTo = safari.self.tab.canLoad(event, event.target.href);
    if (redirectTo) {
      event.target.href = redirectTo;
    }
  }
}

function handleSubmit(event) {
  if (event.target instanceof HTMLFormElement) {
    var redirectTo = safari.self.tab.canLoad(event, event.target.action);
    if (redirectTo) {
      event.target.action = redirectTo;
    }
  }
}

document.addEventListener("click", handleClick, true);
document.addEventListener("submit", handleSubmit, true);
