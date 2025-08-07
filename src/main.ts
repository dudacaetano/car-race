import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

interface Car {
  name: string;
  position: number;
  speed: number;
  color: string;
  emoji: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-container">
      <div class="header">
        <h1>🏁 Corrida: Ferrari vs McLaren 🏁</h1>
        <div class="controls">
          <button (click)="startRace()" [disabled]="raceActive" class="start-btn">
            {{ raceActive ? 'Corrida em Andamento...' : 'Iniciar Corrida' }}
          </button>
          <button (click)="resetRace()" class="reset-btn">Reiniciar</button>
        </div>
      </div>

      <div class="race-info" *ngIf="winner">
        <div class="winner-announcement">
          🏆 {{ winner }} Venceu! 🏆
        </div>
      </div>

      <div class="race-track">
        <div class="track-line"></div>
        
        <div class="car-lane ferrari-lane">
          <div class="car ferrari" 
               [style.transform]="'translateX(' + ferrari.position + 'px)'">
            <span class="car-emoji">🏎️</span>
            <span class="car-name">Ferrari</span>
          </div>
          <div class="lane-label">Ferrari</div>
        </div>

        <div class="car-lane mclaren-lane">
          <div class="car mclaren" 
               [style.transform]="'translateX(' + mclaren.position + 'px)'">
            <span class="car-emoji">🏎️</span>
            <span class="car-name">McLaren</span>
          </div>
          <div class="lane-label">McLaren</div>
        </div>

        <div class="finish-line">
          <div class="finish-flag">🏁</div>
        </div>
      </div>

      <div class="stats">
        <div class="car-stats ferrari-stats">
          <h3>🔴 Ferrari</h3>
          <p>Velocidade: {{ ferrari.speed.toFixed(1) }} km/h</p>
          <p>Posição: {{ ferrari.position.toFixed(0) }}m</p>
        </div>
        
        <div class="car-stats mclaren-stats">
          <h3>🟠 McLaren</h3>
          <p>Velocidade: {{ mclaren.speed.toFixed(1) }} km/h</p>
          <p>Posição: {{ mclaren.position.toFixed(0) }}m</p>
        </div>
      </div>

      <div class="instructions">
        <p><strong>Instruções:</strong></p>
        <p>• Pressione <kbd>F</kbd> para acelerar a Ferrari</p>
        <p>• Pressione <kbd>M</kbd> para acelerar a McLaren</p>
        <p>• Clique em "Iniciar Corrida" para começar!</p>
      </div>
    </div>
  `,
  styles: [`
    .game-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      padding: 20px;
      font-family: 'Arial', sans-serif;
      color: white;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }

    .controls {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-bottom: 20px;
    }

    .start-btn, .reset-btn {
      padding: 12px 24px;
      font-size: 1.1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: bold;
    }

    .start-btn {
      background: linear-gradient(45deg, #4CAF50, #45a049);
      color: white;
    }

    .start-btn:disabled {
      background: #666;
      cursor: not-allowed;
    }

    .reset-btn {
      background: linear-gradient(45deg, #f44336, #da190b);
      color: white;
    }

    .start-btn:hover:not(:disabled), .reset-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }

    .race-info {
      text-align: center;
      margin-bottom: 20px;
    }

    .winner-announcement {
      background: linear-gradient(45deg, #FFD700, #FFA500);
      color: #000;
      padding: 15px;
      border-radius: 10px;
      font-size: 1.5rem;
      font-weight: bold;
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    .race-track {
      position: relative;
      background: #2d5a27;
      border-radius: 15px;
      padding: 30px;
      margin: 30px 0;
      min-height: 200px;
      box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
    }

    .track-line {
      position: absolute;
      top: 50%;
      left: 30px;
      right: 30px;
      height: 3px;
      background: repeating-linear-gradient(
        to right,
        white 0px,
        white 20px,
        transparent 20px,
        transparent 40px
      );
      transform: translateY(-50%);
    }

    .car-lane {
      position: relative;
      height: 80px;
      margin: 20px 0;
      border-bottom: 2px solid rgba(255,255,255,0.3);
    }

    .car {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255,255,255,0.1);
      padding: 8px 15px;
      border-radius: 25px;
      transition: transform 0.1s ease-out;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255,255,255,0.2);
    }

    .ferrari {
      border-color: #dc143c;
      background: rgba(220, 20, 60, 0.2);
    }

    .mclaren {
      border-color: #ff8c00;
      background: rgba(255, 140, 0, 0.2);
    }

    .car-emoji {
      font-size: 1.5rem;
      filter: hue-rotate(0deg);
    }

    .ferrari .car-emoji {
      filter: hue-rotate(-20deg) saturate(1.5);
    }

    .mclaren .car-emoji {
      filter: hue-rotate(20deg) saturate(1.2);
    }

    .car-name {
      font-weight: bold;
      font-size: 0.9rem;
    }

    .lane-label {
      position: absolute;
      left: -80px;
      top: 50%;
      transform: translateY(-50%);
      font-weight: bold;
      font-size: 1.1rem;
    }

    .finish-line {
      position: absolute;
      right: 30px;
      top: 0;
      bottom: 0;
      width: 4px;
      background: repeating-linear-gradient(
        to bottom,
        black 0px,
        black 10px,
        white 10px,
        white 20px
      );
    }

    .finish-flag {
      position: absolute;
      top: -10px;
      right: -15px;
      font-size: 2rem;
      animation: wave 2s ease-in-out infinite;
    }

    @keyframes wave {
      0%, 100% { transform: rotate(-5deg); }
      50% { transform: rotate(5deg); }
    }

    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 30px 0;
    }

    .car-stats {
      background: rgba(255,255,255,0.1);
      padding: 20px;
      border-radius: 10px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
    }

    .ferrari-stats {
      border-left: 4px solid #dc143c;
    }

    .mclaren-stats {
      border-left: 4px solid #ff8c00;
    }

    .car-stats h3 {
      margin: 0 0 10px 0;
      font-size: 1.3rem;
    }

    .car-stats p {
      margin: 5px 0;
      font-size: 1rem;
    }

    .instructions {
      background: rgba(0,0,0,0.3);
      padding: 20px;
      border-radius: 10px;
      text-align: center;
    }

    .instructions p {
      margin: 8px 0;
    }

    kbd {
      background: #333;
      color: #fff;
      padding: 3px 8px;
      border-radius: 4px;
      font-family: monospace;
      font-weight: bold;
    }

    @media (max-width: 768px) {
      .game-container {
        padding: 10px;
      }
      
      .header h1 {
        font-size: 1.8rem;
      }
      
      .stats {
        grid-template-columns: 1fr;
      }
      
      .controls {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class App implements OnInit, OnDestroy {
  ferrari: Car = {
    name: 'Ferrari',
    position: 0,
    speed: 0,
    color: '#dc143c',
    emoji: '🏎️'
  };

  mclaren: Car = {
    name: 'McLaren',
    position: 0,
    speed: 0,
    color: '#ff8c00',
    emoji: '🏎️'
  };

  raceActive = false;
  winner: string | null = null;
  private gameLoop: any;
  private readonly FINISH_LINE = 1200;
  private readonly MAX_SPEED = 100;

  ngOnInit() {
    this.resetRace();
  }

  ngOnDestroy() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    if (!this.raceActive || this.winner) return;

    const key = event.key.toLowerCase();
    
    if (key === 'f') {
      this.accelerateCar(this.ferrari);
      event.preventDefault();
    } else if (key === 'm') {
      this.accelerateCar(this.mclaren);
      event.preventDefault();
    }
  }

  startRace() {
    if (this.raceActive) return;
    
    this.raceActive = true;
    this.winner = null;
    
    this.gameLoop = setInterval(() => {
      this.updateGame();
    }, 50);
  }

  resetRace() {
    this.raceActive = false;
    this.winner = null;
    
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }

    this.ferrari.position = 0;
    this.ferrari.speed = 0;
    this.mclaren.position = 0;
    this.mclaren.speed = 0;
  }

  private accelerateCar(car: Car) {
    // Aumenta a velocidade com um pouco de aleatoriedade
    const acceleration = 12.0 + Math.random() * 8.0;
    car.speed = Math.min(car.speed + acceleration, this.MAX_SPEED);
  }

  private updateGame() {
    if (!this.raceActive || this.winner) return;

    // Atualiza posições
    this.ferrari.position += this.ferrari.speed;
    this.mclaren.position += this.mclaren.speed;

    // Aplica resistência (desaceleração natural)
    this.ferrari.speed = Math.max(0, this.ferrari.speed - 1.0);
    this.mclaren.speed = Math.max(0, this.mclaren.speed - 1.0);

    // Adiciona um pouco de variação aleatória na velocidade
    this.ferrari.speed += (Math.random() - 0.5) * 5.0;
    this.mclaren.speed += (Math.random() - 0.5) * 5.0;

    // Garante que a velocidade não seja negativa
    this.ferrari.speed = Math.max(0, this.ferrari.speed);
    this.mclaren.speed = Math.max(0, this.mclaren.speed);

    // Verifica se alguém ganhou
    // Limita a posição máxima dos carros para não ultrapassar a tela
    this.ferrari.position = Math.min(this.ferrari.position, this.FINISH_LINE);
    this.mclaren.position = Math.min(this.mclaren.position, this.FINISH_LINE);
    if (this.ferrari.position >= this.FINISH_LINE && !this.winner) {
      this.winner = 'Ferrari';
      this.endRace();
    } else if (this.mclaren.position >= this.FINISH_LINE && !this.winner) {
      this.winner = 'McLaren';
      this.endRace();
    }
  }

  private endRace() {
    this.raceActive = false;
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }
  }
}

bootstrapApplication(App);