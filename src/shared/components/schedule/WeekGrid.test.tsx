import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react'
import { WeekGrid } from './WeekGrid'
import { dayOfWeekToIndex, indexToDayOfWeek, dateToDayIndex } from './weekGridUtils'
import type { WeekGridItem } from './weekGridUtils'

afterEach(cleanup)

const baseItem: WeekGridItem = {
  id: 1,
  dayIndex: 0, // lunes
  startTime: '10:00',
  endTime: '12:00',
  classroom: 'AULA_PORTAL1',
}

describe('WeekGrid', () => {
  it('divide cada día en una sub-columna por aula (Portal 1 | Portal 2 | Virtual)', () => {
    render(<WeekGrid items={[]} renderItem={() => null} />)

    // 6 días × 3 aulas = 18 celdas
    for (let day = 0; day < 6; day++) {
      expect(screen.getByTestId(`cell-${day}-AULA_PORTAL1`)).toBeInTheDocument()
      expect(screen.getByTestId(`cell-${day}-AULA_PORTAL2`)).toBeInTheDocument()
      expect(screen.getByTestId(`cell-${day}-AULA_VIRTUAL`)).toBeInTheDocument()
    }
  })

  it('coloca cada item en la sub-columna de SU aula, no encima de las demás', () => {
    const items: WeekGridItem[] = [
      { ...baseItem, id: 1, classroom: 'AULA_PORTAL1' },
      { ...baseItem, id: 2, classroom: 'AULA_PORTAL2' },
      { ...baseItem, id: 3, classroom: 'AULA_VIRTUAL' },
    ]
    render(
      <WeekGrid
        items={items}
        renderItem={(item) => <span>bloque-{item.id}</span>}
      />
    )

    // Mismo día y hora, pero cada uno en la celda de su aula
    expect(within(screen.getByTestId('cell-0-AULA_PORTAL1')).getByText('bloque-1')).toBeInTheDocument()
    expect(within(screen.getByTestId('cell-0-AULA_PORTAL2')).getByText('bloque-2')).toBeInTheDocument()
    expect(within(screen.getByTestId('cell-0-AULA_VIRTUAL')).getByText('bloque-3')).toBeInTheDocument()
    expect(within(screen.getByTestId('cell-0-AULA_PORTAL1')).queryByText('bloque-2')).toBeNull()
  })

  it('con un aula seleccionada solo renderiza esa sub-columna', () => {
    render(<WeekGrid items={[]} classrooms={['AULA_PORTAL2']} renderItem={() => null} />)

    expect(screen.getByTestId('cell-0-AULA_PORTAL2')).toBeInTheDocument()
    expect(screen.queryByTestId('cell-0-AULA_PORTAL1')).toBeNull()
    expect(screen.queryByTestId('cell-0-AULA_VIRTUAL')).toBeNull()
  })

  it('onCellClick informa del día y el aula de la celda clicada', () => {
    const onCellClick = vi.fn()
    render(<WeekGrid items={[]} renderItem={() => null} onCellClick={onCellClick} />)

    fireEvent.click(screen.getByTestId('cell-2-AULA_PORTAL2'))

    // jsdom: getBoundingClientRect a 0 → clic equivale al inicio de la rejilla (08:00)
    expect(onCellClick).toHaveBeenCalledWith(2, 'AULA_PORTAL2', '08:00')
  })

  it('posiciona el bloque según su franja horaria (top y height en px)', () => {
    render(
      <WeekGrid
        items={[{ ...baseItem, startTime: '10:00', endTime: '11:30' }]}
        renderItem={(item) => <span>bloque-{item.id}</span>}
      />
    )

    const wrapper = screen.getByText('bloque-1').parentElement as HTMLElement
    // 10:00 = 2h tras las 08:00 → top 120px; 1,5h → height 90px
    expect(wrapper.style.top).toBe('120px')
    expect(wrapper.style.height).toBe('90px')
  })
})

describe('helpers de día', () => {
  it('dayOfWeekToIndex ↔ indexToDayOfWeek', () => {
    expect(dayOfWeekToIndex('MONDAY')).toBe(0)
    expect(dayOfWeekToIndex('SATURDAY')).toBe(5)
    expect(dayOfWeekToIndex('SUNDAY')).toBe(-1)
    expect(indexToDayOfWeek(0)).toBe('MONDAY')
    expect(indexToDayOfWeek(5)).toBe('SATURDAY')
  })

  it('dateToDayIndex mapea lunes→0 y domingo→6 (fuera de la rejilla)', () => {
    expect(dateToDayIndex('2026-07-13')).toBe(0) // lunes
    expect(dateToDayIndex('2026-07-18')).toBe(5) // sábado
    expect(dateToDayIndex('2026-07-19')).toBe(6) // domingo
  })
})
