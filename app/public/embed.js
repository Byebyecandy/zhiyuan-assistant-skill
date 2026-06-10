(function () {
  const currentScript = document.currentScript;
  const baseUrl = (currentScript && currentScript.dataset.baseUrl) || window.location.origin;
  const mountId = (currentScript && currentScript.dataset.mount) || "zhiyuan-assistant-widget";

  const style = document.createElement("style");
  style.textContent = `
    .zy-widget{font-family:"Microsoft YaHei",system-ui,sans-serif;max-width:420px;border:1px solid #dce3dd;border-radius:10px;background:#fff;box-shadow:0 18px 50px rgba(23,32,26,.13);overflow:hidden;color:#17201a}
    .zy-head{padding:14px 16px;background:#19705b;color:white}
    .zy-head strong{font-size:18px}
    .zy-head span{display:block;font-size:12px;opacity:.9;margin-top:3px}
    .zy-body{padding:12px;display:grid;gap:10px}
    .zy-chat{min-height:160px;max-height:280px;overflow:auto;background:#f5f7f4;border:1px solid #dce3dd;border-radius:8px;padding:10px;white-space:pre-wrap;font-size:15px;line-height:1.55}
    .zy-input{width:100%;min-height:82px;border:1px solid #dce3dd;border-radius:8px;padding:10px;font:inherit;font-size:16px}
    .zy-row{display:flex;gap:8px;flex-wrap:wrap}
    .zy-select,.zy-small{min-height:38px;border:1px solid #dce3dd;border-radius:8px;padding:7px 9px;font:inherit}
    .zy-small{flex:1;min-width:100px}
    .zy-btn{min-height:40px;border:0;border-radius:8px;background:#19705b;color:white;padding:8px 14px;font-weight:800;cursor:pointer}
  `;
  document.head.appendChild(style);

  const mount = document.getElementById(mountId) || document.body.appendChild(document.createElement("div"));
  mount.id = mountId;
  mount.innerHTML = `
    <div class="zy-widget">
      <div class="zy-head"><strong>志愿助手</strong><span>给家长看的志愿问答</span></div>
      <div class="zy-body">
        <div class="zy-row">
          <select class="zy-select" data-role="version">
            <option value="ultimate">终极版</option>
            <option value="reality">现实版</option>
            <option value="chain">全链路版</option>
            <option value="rules">规则版</option>
            <option value="fit">院校专业版</option>
            <option value="career">本地职业版</option>
          </select>
          <input class="zy-small" data-role="province" placeholder="省份" />
          <input class="zy-small" data-role="year" placeholder="年份" />
        </div>
        <div class="zy-chat" data-role="chat">请直接问：某某大学怎么样？孩子多少分怎么报？</div>
        <textarea class="zy-input" data-role="message" placeholder="例如：江苏物化生580分，想报南京信息工程大学计算机，稳不稳？"></textarea>
        <button class="zy-btn" data-role="send">问一下</button>
      </div>
    </div>
  `;

  const chat = mount.querySelector('[data-role="chat"]');
  const message = mount.querySelector('[data-role="message"]');
  const send = mount.querySelector('[data-role="send"]');

  send.addEventListener("click", async () => {
    const text = message.value.trim();
    if (!text) return;
    chat.textContent = "正在帮你查最新院校信息...";
    send.disabled = true;
    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: text,
          version: mount.querySelector('[data-role="version"]').value,
          province: mount.querySelector('[data-role="province"]').value,
          year: mount.querySelector('[data-role="year"]').value,
          autoSearch: true
        })
      });
      const data = await response.json();
      chat.textContent = data.answer || data.error || "没有拿到回答。";
    } catch (error) {
      chat.textContent = `请求失败：${error.message}`;
    } finally {
      send.disabled = false;
    }
  });
})();
