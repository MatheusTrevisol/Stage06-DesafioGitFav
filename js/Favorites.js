import { GithubUser } from "./GithubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)
      
      if(userExists) {
        throw new Error('Usuário já existe!')
      }

      const user = await GithubUser.search(username);
      
      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update();
      this.save();
    } catch(e) {
      alert(e.message)
    }
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }
  
  delete(user) {
    const newFilteredUsers = this.entries.filter(entry => entry.login !== user.login)

    this.entries = newFilteredUsers
    this.save();
    this.update();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbodyNoUser = this.root.querySelector('table #body-noUsers')
    this.tbodyUser = this.root.querySelector('table #body-users')

    this.update()
    this.onadd()
  }

  onadd() {
    const buttonAdd = this.root.querySelector('#searchBar button')
    buttonAdd.addEventListener('click', () => {
      const { value } = this.root.querySelector('#searchBar input')
      
      this.add(value);
    })
  }

  update() {
    this.removeAllTr();

    if(this.entries.length == 0) {
      this.tbodyUser.classList.add('hide')
      this.tbodyNoUser.classList.remove('hide')
    } else {
      this.tbodyUser.classList.remove('hide')
      this.tbodyNoUser.classList.add('hide')
    }

    this.entries.forEach((user) => {
      const tr = this.createRow();

      tr.querySelector('.user img').src = `https://github.com/${user.login}.png`
      tr.querySelector('.user p').textContent = `${user.name}`
      tr.querySelector('.user span').textContent = `${user.login}`
      tr.querySelector('.repositories span').textContent = `${user.public_repos}`
      tr.querySelector('.followers span').textContent = `${user.followers}`
      tr.querySelector('.remove .delete').addEventListener('click', () => {
        let isConfirm = confirm('Tem certeza que deseja deletar este usuário?')

        if(isConfirm) {
          this.delete(user);
        }
      })

      this.tbodyUser.append(tr)
    })
  }

  createRow() {
    const tr = document.createElement('tr')
    tr.innerHTML = 
    `
      <tr>
        <td class="user">
          <img src="https://github.com/MatheusTrevisol.png" alt="Foto de perfil da pessoa">
          <a href="">
            <p>Mayk Brito</p>
            <span>/maykbrito</span>
          </a>
        </td>
        <td class="repositories">
          <span>123</span>
        </td>
        <td class="followers">
          <span>1234</span>
        </td>
        <td class="remove">
          <button class="delete">Remover</button>
        </td>
      </tr>
    `
    return tr;
  }

  removeAllTr() {
    const tr = this.tbodyUser.querySelectorAll('tr')
    
    tr.forEach(user => {
      user.remove();
    })
  }
}